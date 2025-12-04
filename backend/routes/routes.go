package routes

import (
	"fui-backend/handlers"
	"fui-backend/middleware"
	"fui-backend/models"
	"fui-backend/services"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App, authHandler *handlers.AuthHandler, proposalHandler *handlers.ProposalHandler, userHandler *handlers.UserHandler, configHandler *handlers.ConfigHandler, loginLogHandler *handlers.LoginLogHandler, jwtService *services.JWTService) {
	api := app.Group("/api")

	// Public routes
	auth := api.Group("/auth")
	auth.Post("/login", authHandler.Login)

	// Protected routes
	protected := api.Group("", middleware.AuthMiddleware(jwtService))
	
	// Auth routes
	protected.Get("/auth/profile", authHandler.GetProfile)
	protected.Post("/auth/logout", authHandler.Logout)

	// Proposal routes
	proposals := protected.Group("/proposals")
	proposals.Get("/", proposalHandler.GetProposals)
	proposals.Post("/", proposalHandler.CreateProposal)
	proposals.Get("/:id", proposalHandler.GetProposal)
	proposals.Put("/:id", proposalHandler.UpdateProposal)
	proposals.Delete("/:id", proposalHandler.DeleteProposal)
	proposals.Post("/:id/submit", proposalHandler.SubmitProposal)
	proposals.Post("/:id/comments", proposalHandler.AddComment)

	// Admin only routes
	admin := protected.Group("/admin", middleware.RoleMiddleware(models.RoleAdmin))
	
	// User management
	admin.Get("/users", userHandler.GetUsers)
	admin.Get("/users/:id", userHandler.GetUser)
	admin.Post("/users", userHandler.CreateUser)
	admin.Put("/users/:id", userHandler.UpdateUser)
	admin.Delete("/users/:id", userHandler.DeleteUser)
	admin.Post("/users/:id/toggle-status", userHandler.ToggleUserStatus)
	
	// LDAP Configuration
	admin.Get("/config/ldap", configHandler.GetLDAPConfig)
	admin.Put("/config/ldap", configHandler.UpdateLDAPConfig)
	admin.Post("/config/ldap/test", configHandler.TestLDAPConnection)
	
	// Login Logs
	admin.Get("/logs/login", loginLogHandler.GetLoginLogs)
	admin.Get("/logs/login/stats", loginLogHandler.GetLoginStats)
	admin.Get("/logs/login/user/:username", loginLogHandler.GetUserLoginHistory)
}
