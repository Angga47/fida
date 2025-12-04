package handlers

import (
	"fui-backend/database"
	"fui-backend/models"

	"github.com/gofiber/fiber/v2"
)

type LoginLogHandler struct{}

func NewLoginLogHandler() *LoginLogHandler {
	return &LoginLogHandler{}
}

type LoginLogResponse struct {
	ID         uint   `json:"id"`
	UserID     *uint  `json:"user_id"`
	Username   string `json:"username"`
	FullName   string `json:"full_name"`
	IPAddress  string `json:"ip_address"`
	UserAgent  string `json:"user_agent"`
	Success    bool   `json:"success"`
	FailReason string `json:"fail_reason,omitempty"`
	LoginAt    string `json:"login_at"`
}

func (h *LoginLogHandler) GetLoginLogs(c *fiber.Ctx) error {
	db := database.GetDB()
	
	var logs []models.LoginLog
	result := db.Order("login_at DESC").Limit(100).Find(&logs)
	
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch login logs",
		})
	}

	// Get user full names
	userMap := make(map[uint]string)
	for _, log := range logs {
		if log.UserID != nil {
			var user models.User
			db.Select("id, full_name").First(&user, *log.UserID)
			userMap[user.ID] = user.FullName
		}
	}

	// Format response
	var response []LoginLogResponse
	for _, log := range logs {
		fullName := ""
		if log.UserID != nil {
			fullName = userMap[*log.UserID]
		}
		
		response = append(response, LoginLogResponse{
			ID:         log.ID,
			UserID:     log.UserID,
			Username:   log.Username,
			FullName:   fullName,
			IPAddress:  log.IPAddress,
			UserAgent:  log.UserAgent,
			Success:    log.Success,
			FailReason: log.FailReason,
			LoginAt:    log.LoginAt.Format("2006-01-02 15:04:05"),
		})
	}

	return c.JSON(response)
}

func (h *LoginLogHandler) GetUserLoginHistory(c *fiber.Ctx) error {
	username := c.Params("username")
	db := database.GetDB()
	
	var logs []models.LoginLog
	result := db.Where("username = ?", username).Order("login_at DESC").Limit(50).Find(&logs)
	
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch login logs",
		})
	}

	// Format response
	var response []LoginLogResponse
	for _, log := range logs {
		response = append(response, LoginLogResponse{
			ID:         log.ID,
			UserID:     log.UserID,
			Username:   log.Username,
			IPAddress:  log.IPAddress,
			UserAgent:  log.UserAgent,
			Success:    log.Success,
			FailReason: log.FailReason,
			LoginAt:    log.LoginAt.Format("2006-01-02 15:04:05"),
		})
	}

	return c.JSON(response)
}

func (h *LoginLogHandler) GetLoginStats(c *fiber.Ctx) error {
	db := database.GetDB()
	
	var totalLogins int64
	var successfulLogins int64
	var failedLogins int64
	
	db.Model(&models.LoginLog{}).Count(&totalLogins)
	db.Model(&models.LoginLog{}).Where("success = ?", true).Count(&successfulLogins)
	db.Model(&models.LoginLog{}).Where("success = ?", false).Count(&failedLogins)
	
	return c.JSON(fiber.Map{
		"total_logins":      totalLogins,
		"successful_logins": successfulLogins,
		"failed_logins":     failedLogins,
	})
}
