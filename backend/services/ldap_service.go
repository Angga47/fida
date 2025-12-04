package services

import (
	"fmt"
	"fui-backend/config"
	"fui-backend/database"
	"fui-backend/models"
	"time"

	"github.com/go-ldap/ldap/v3"
)

type LDAPService struct {
	config *config.LDAPConfig
}

func NewLDAPService(cfg *config.LDAPConfig) *LDAPService {
	return &LDAPService{config: cfg}
}

func (s *LDAPService) Authenticate(username, password string) (*models.User, error) {
	// Connect to LDAP server
	l, err := ldap.Dial("tcp", fmt.Sprintf("%s:%d", s.config.Server, s.config.Port))
	if err != nil {
		return nil, fmt.Errorf("failed to connect to LDAP server: %w", err)
	}
	defer l.Close()

	// Upgrade to TLS if needed (optional for testing)
	// err = l.StartTLS(&tls.Config{InsecureSkipVerify: true})
	// if err != nil {
	//     return nil, fmt.Errorf("failed to upgrade to TLS: %w", err)
	// }

	// First bind with admin credentials
	err = l.Bind(s.config.BindUsername, s.config.BindPassword)
	if err != nil {
		return nil, fmt.Errorf("failed to bind with admin credentials: %w", err)
	}

	// Search for user
	searchRequest := ldap.NewSearchRequest(
		s.config.BaseDN,
		ldap.ScopeWholeSubtree, ldap.NeverDerefAliases, 0, 0, false,
		fmt.Sprintf("(&(objectClass=user)(sAMAccountName=%s))", username),
		[]string{"dn", "cn", "mail", "displayName", "department", "memberOf"},
		nil,
	)

	sr, err := l.Search(searchRequest)
	if err != nil {
		return nil, fmt.Errorf("failed to search user: %w", err)
	}

	if len(sr.Entries) == 0 {
		return nil, fmt.Errorf("user not found")
	}

	userDN := sr.Entries[0].DN
	cn := sr.Entries[0].GetAttributeValue("cn")
	email := sr.Entries[0].GetAttributeValue("mail")
	displayName := sr.Entries[0].GetAttributeValue("displayName")
	department := sr.Entries[0].GetAttributeValue("department")

	// Try to bind with user credentials
	err = l.Bind(userDN, password)
	if err != nil {
		return nil, fmt.Errorf("invalid credentials")
	}

	// Get or create user in database
	db := database.GetDB()
	var user models.User
	
	result := db.Where("username = ?", username).First(&user)
	if result.Error != nil {
		// Create new user with default role
		user = models.User{
			Username:   username,
			Email:      email,
			FullName:   displayName,
			Department: department,
			Role:       models.RoleCorpFA, // Default role, can be changed by admin
			IsActive:   true,
		}
		if err := db.Create(&user).Error; err != nil {
			return nil, fmt.Errorf("failed to create user: %w", err)
		}
	} else {
		// Update user info
		now := time.Now()
		user.LastLoginAt = &now
		user.Email = email
		user.FullName = displayName
		user.Department = department
		db.Save(&user)
	}

	if !user.IsActive {
		return nil, fmt.Errorf("user account is not active")
	}

	// Use cn if displayName is empty
	if user.FullName == "" {
		user.FullName = cn
	}

	return &user, nil
}

func (s *LDAPService) TestConnection() error {
	l, err := ldap.Dial("tcp", fmt.Sprintf("%s:%d", s.config.Server, s.config.Port))
	if err != nil {
		return fmt.Errorf("failed to connect to LDAP server: %w", err)
	}
	defer l.Close()

	err = l.Bind(s.config.BindUsername, s.config.BindPassword)
	if err != nil {
		return fmt.Errorf("failed to bind with admin credentials: %w", err)
	}

	return nil
}
