package models

import (
	"time"

	"gorm.io/gorm"
)

type LoginLog struct {
	ID         uint           `gorm:"primarykey" json:"id"`
	UserID     *uint          `json:"user_id"` // Nullable if login failed
	Username   string         `gorm:"not null" json:"username"`
	IPAddress  string         `json:"ip_address"`
	UserAgent  string         `json:"user_agent"`
	Success    bool           `gorm:"default:false" json:"success"`
	FailReason string         `json:"fail_reason,omitempty"`
	LoginAt    time.Time      `gorm:"autoCreateTime" json:"login_at"`
	CreatedAt  time.Time      `json:"created_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}
