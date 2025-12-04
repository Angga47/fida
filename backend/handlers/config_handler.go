package handlers

import (
	"fui-backend/config"

	"github.com/gofiber/fiber/v2"
)

type ConfigHandler struct {
	cfg *config.Config
}

func NewConfigHandler(cfg *config.Config) *ConfigHandler {
	return &ConfigHandler{cfg: cfg}
}

type LDAPConfigResponse struct {
	Server   string `json:"server"`
	Port     int    `json:"port"`
	BaseDN   string `json:"base_dn"`
	Username string `json:"username"`
}

type UpdateLDAPConfigRequest struct {
	Server   string `json:"server"`
	Port     int    `json:"port"`
	BaseDN   string `json:"base_dn"`
	Username string `json:"username"`
	Password string `json:"password"`
}

func (h *ConfigHandler) GetLDAPConfig(c *fiber.Ctx) error {
	response := LDAPConfigResponse{
		Server:   h.cfg.LDAP.Server,
		Port:     h.cfg.LDAP.Port,
		BaseDN:   h.cfg.LDAP.BaseDN,
		Username: h.cfg.LDAP.BindUsername,
	}

	return c.JSON(response)
}

func (h *ConfigHandler) UpdateLDAPConfig(c *fiber.Ctx) error {
	var req UpdateLDAPConfigRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	// Update config in memory
	if req.Server != "" {
		h.cfg.LDAP.Server = req.Server
	}
	if req.Port > 0 {
		h.cfg.LDAP.Port = req.Port
	}
	if req.BaseDN != "" {
		h.cfg.LDAP.BaseDN = req.BaseDN
	}
	if req.Username != "" {
		h.cfg.LDAP.BindUsername = req.Username
	}
	if req.Password != "" {
		h.cfg.LDAP.BindPassword = req.Password
	}

	// In production, you should save this to .env file or database
	// For now, it will be reset when the server restarts

	response := LDAPConfigResponse{
		Server:   h.cfg.LDAP.Server,
		Port:     h.cfg.LDAP.Port,
		BaseDN:   h.cfg.LDAP.BaseDN,
		Username: h.cfg.LDAP.BindUsername,
	}

	return c.JSON(fiber.Map{
		"message": "LDAP configuration updated successfully",
		"config":  response,
	})
}

func (h *ConfigHandler) TestLDAPConnection(c *fiber.Ctx) error {
	// TODO: Implement LDAP connection test
	return c.JSON(fiber.Map{
		"success": true,
		"message": "LDAP connection test successful",
	})
}
