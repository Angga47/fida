package main

import (
	"fmt"
	"fui-backend/config"
	"fui-backend/database"
	"fui-backend/handlers"
	"fui-backend/routes"
	"fui-backend/services"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Failed to load configuration:", err)
	}

	// Connect to database
	if err := database.Connect(cfg); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Run migrations
	if err := database.Migrate(); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Initialize services
	ldapService := services.NewLDAPService(&cfg.LDAP)
	jwtService := services.NewJWTService(&cfg.JWT)

	// Test LDAP connection
	if err := ldapService.TestConnection(); err != nil {
		log.Println("Warning: LDAP connection test failed:", err)
	} else {
		log.Println("LDAP connection test successful")
	}

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(ldapService, jwtService)
	proposalHandler := handlers.NewProposalHandler()
	userHandler := handlers.NewUserHandler()
	configHandler := handlers.NewConfigHandler(cfg)
	loginLogHandler := handlers.NewLoginLogHandler()

	// Create Fiber app
	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{
				"error": err.Error(),
			})
		},
	})

	// Middleware
	app.Use(recover.New())
	app.Use(logger.New(logger.Config{
		Format: "[${time}] ${status} - ${latency} ${method} ${path}\n",
	}))
	app.Use(cors.New(cors.Config{
		AllowOrigins: cfg.FrontendURL,
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	// Setup routes
	routes.SetupRoutes(app, authHandler, proposalHandler, userHandler, configHandler, loginLogHandler, jwtService)

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status": "ok",
			"message": "FUI Backend API is running",
		})
	})

	// Start server
	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("Server starting on http://localhost%s", addr)
	if err := app.Listen(addr); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
