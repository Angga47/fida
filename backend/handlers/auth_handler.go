package handlers

import (
	"fmt"
	"fui-backend/database"
	"fui-backend/models"
	"fui-backend/services"
	"time"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	ldapService *services.LDAPService
	jwtService  *services.JWTService
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string       `json:"token"`
	User  *models.User `json:"user"`
}

func NewAuthHandler(ldapService *services.LDAPService, jwtService *services.JWTService) *AuthHandler {
	return &AuthHandler{
		ldapService: ldapService,
		jwtService:  jwtService,
	}
}

func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	if req.Username == "" || req.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "username and password are required",
		})
	}

	db := database.GetDB()
	ipAddress := c.IP()
	userAgent := c.Get("User-Agent")

	// Check if user exists in database
	var existingUser models.User
	result := db.Where("username = ?", req.Username).First(&existingUser)
	
	if result.Error != nil {
		// User not found in database
		h.logFailedLogin(req.Username, ipAddress, userAgent, "User tidak terdaftar dalam sistem")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User tidak terdaftar. Silakan hubungi administrator.",
		})
	}

	// Check if user is active
	if !existingUser.IsActive {
		h.logFailedLogin(req.Username, ipAddress, userAgent, "User tidak aktif")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Akun Anda tidak aktif. Silakan hubungi administrator.",
		})
	}

	var user *models.User
	var err error

	// Try LDAP authentication if user is LDAP user
	if existingUser.IsLDAPUser {
		user, err = h.ldapService.Authenticate(req.Username, req.Password)
		if err != nil {
			h.logFailedLogin(req.Username, ipAddress, userAgent, "Password LDAP salah")
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Username atau password salah",
			})
		}
		// Update user data from database (role, etc)
		user.ID = existingUser.ID
		user.Role = existingUser.Role
		user.IsActive = existingUser.IsActive
		user.IsLDAPUser = existingUser.IsLDAPUser
	} else {
		// Manual user authentication
		user, err = h.authenticateManualUser(req.Username, req.Password)
		if err != nil {
			h.logFailedLogin(req.Username, ipAddress, userAgent, "Password salah")
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Username atau password salah",
			})
		}
	}

	// Update last login time
	now := time.Now()
	user.LastLoginAt = &now
	db.Model(&user).Update("last_login_at", now)

	// Log successful login
	h.logSuccessfulLogin(user.ID, req.Username, ipAddress, userAgent)

	// Generate JWT token
	token, err := h.jwtService.GenerateToken(user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "failed to generate token",
		})
	}

	return c.JSON(LoginResponse{
		Token: token,
		User:  user,
	})
}

func (h *AuthHandler) authenticateManualUser(username, password string) (*models.User, error) {
	db := database.GetDB()
	
	var user models.User
	result := db.Where("username = ? AND is_ldap_user = ?", username, false).First(&user)
	if result.Error != nil {
		return nil, fmt.Errorf("user not found")
	}

	// Check password hash
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, fmt.Errorf("invalid password")
	}

	return &user, nil
}

func (h *AuthHandler) logSuccessfulLogin(userID uint, username, ipAddress, userAgent string) {
	db := database.GetDB()
	
	loginLog := models.LoginLog{
		UserID:    &userID,
		Username:  username,
		IPAddress: ipAddress,
		UserAgent: userAgent,
		Success:   true,
		LoginAt:   time.Now(),
	}
	
	db.Create(&loginLog)
}

func (h *AuthHandler) logFailedLogin(username, ipAddress, userAgent, reason string) {
	db := database.GetDB()
	
	loginLog := models.LoginLog{
		UserID:     nil,
		Username:   username,
		IPAddress:  ipAddress,
		UserAgent:  userAgent,
		Success:    false,
		FailReason: reason,
		LoginAt:    time.Now(),
	}
	
	db.Create(&loginLog)
}

func (h *AuthHandler) GetProfile(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)
	username := c.Locals("username").(string)
	role := c.Locals("role").(models.UserRole)

	return c.JSON(fiber.Map{
		"user_id":  userID,
		"username": username,
		"role":     role,
	})
}

func (h *AuthHandler) Logout(c *fiber.Ctx) error {
	// With JWT, logout is handled on client side by removing the token
	return c.JSON(fiber.Map{
		"message": "logged out successfully",
	})
}
