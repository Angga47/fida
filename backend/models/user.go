package models

import (
	"time"

	"gorm.io/gorm"
)

type UserRole string

const (
	RoleAdmin                  UserRole = "admin"
	RoleCorpFA                 UserRole = "Corp FA"
	RoleDirektur               UserRole = "Direktur"
	RoleCEO                    UserRole = "CEO"
	RoleCFO                    UserRole = "CFO"
	RoleSourcingAndProcurement UserRole = "Sourcing dan Procurement"
)

type User struct {
	ID          uint           `gorm:"primarykey" json:"id"`
	Username    string         `gorm:"uniqueIndex;not null" json:"username"`
	Email       string         `gorm:"uniqueIndex" json:"email"`
	FullName    string         `json:"full_name"`
	Password    string         `json:"-"` // For non-LDAP users
	Role        UserRole       `gorm:"type:varchar(50);not null" json:"role"`
	Department  string         `json:"department"`
	IsActive    bool           `gorm:"default:true" json:"is_active"`
	IsLDAPUser  bool           `gorm:"default:true" json:"is_ldap_user"`
	LastLoginAt *time.Time     `json:"last_login_at"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

func (u *User) HasRole(roles ...UserRole) bool {
	for _, role := range roles {
		if u.Role == role {
			return true
		}
	}
	return false
}

func (u *User) IsAdmin() bool {
	return u.Role == RoleAdmin
}
