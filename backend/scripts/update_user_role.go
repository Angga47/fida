package main

import (
	"fmt"
	"log"
	"os"

	"gorm.io/gorm"

	"fui-backend/config"
	"fui-backend/database"
	"fui-backend/models"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize database
	if err := database.Connect(cfg); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	db := database.GetDB()

	// Get username from command line
	if len(os.Args) < 3 {
		fmt.Println("Usage: go run update_user_role.go <username> <role>")
		fmt.Println("Available roles: admin, Corp FA, Direktur, CEO, CFO, Sourcing dan Procurement")
		os.Exit(1)
	}

	username := os.Args[1]
	role := models.UserRole(os.Args[2])

	// Validate role
	validRoles := []models.UserRole{
		models.RoleAdmin,
		models.RoleCorpFA,
		models.RoleDirektur,
		models.RoleCEO,
		models.RoleCFO,
		models.RoleSourcingAndProcurement,
	}

	isValidRole := false
	for _, validRole := range validRoles {
		if role == validRole {
			isValidRole = true
			break
		}
	}

	if !isValidRole {
		fmt.Printf("Invalid role: %s\n", role)
		fmt.Println("Available roles: admin, Corp FA, Direktur, CEO, CFO, Sourcing dan Procurement")
		os.Exit(1)
	}

	// Update user role
	var user models.User
	result := db.Where("username = ?", username).First(&user)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			fmt.Printf("User '%s' not found\n", username)
			os.Exit(1)
		}
		log.Fatalf("Error finding user: %v", result.Error)
	}

	oldRole := user.Role
	user.Role = role

	if err := db.Save(&user).Error; err != nil {
		log.Fatalf("Error updating user: %v", err)
	}

	fmt.Printf("✓ User '%s' role updated successfully!\n", username)
	fmt.Printf("  Old role: %s\n", oldRole)
	fmt.Printf("  New role: %s\n", role)
	fmt.Printf("  Full name: %s\n", user.FullName)
	fmt.Printf("  Email: %s\n", user.Email)
	fmt.Printf("  Active: %v\n", user.IsActive)
}
