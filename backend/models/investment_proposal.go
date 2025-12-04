package models

import (
	"time"

	"gorm.io/gorm"
)

type ProposalStatus string

const (
	StatusDraft     ProposalStatus = "draft"
	StatusSubmitted ProposalStatus = "submitted"
	StatusReviewing ProposalStatus = "reviewing"
	StatusApproved  ProposalStatus = "approved"
	StatusRejected  ProposalStatus = "rejected"
	StatusRevision  ProposalStatus = "revision"
)

type InvestmentProposal struct {
	ID                  uint           `gorm:"primarykey" json:"id"`
	ProposalNumber      string         `gorm:"uniqueIndex;not null" json:"proposal_number"`
	Title               string         `gorm:"not null" json:"title"`
	Description         string         `gorm:"type:text" json:"description"`
	InvestmentType      string         `json:"investment_type"` // IT, Operasional, dll
	EstimatedCost       float64        `json:"estimated_cost"`
	Currency            string         `gorm:"default:'IDR'" json:"currency"`
	ProposalDate        time.Time      `json:"proposal_date"`
	ExpectedStartDate   time.Time      `json:"expected_start_date"`
	ExpectedCompletDate time.Time      `json:"expected_complete_date"`
	Justification       string         `gorm:"type:text" json:"justification"`
	ExpectedBenefit     string         `gorm:"type:text" json:"expected_benefit"`
	RiskAnalysis        string         `gorm:"type:text" json:"risk_analysis"`
	Status              ProposalStatus `gorm:"type:varchar(20);default:'draft'" json:"status"`

	// Relations
	SubmittedByID uint   `json:"submitted_by_id"`
	SubmittedBy   User   `gorm:"foreignKey:SubmittedByID" json:"submitted_by"`
	DepartmentID  string `json:"department_id"`

	// Attachments
	Attachments []Attachment `gorm:"foreignKey:ProposalID" json:"attachments,omitempty"`

	// Approvals
	Approvals []Approval `gorm:"foreignKey:ProposalID" json:"approvals,omitempty"`

	// Comments
	Comments []Comment `gorm:"foreignKey:ProposalID" json:"comments,omitempty"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type Attachment struct {
	ID         uint      `gorm:"primarykey" json:"id"`
	ProposalID uint      `json:"proposal_id"`
	FileName   string    `json:"file_name"`
	FilePath   string    `json:"file_path"`
	FileSize   int64     `json:"file_size"`
	FileType   string    `json:"file_type"`
	UploadedBy uint      `json:"uploaded_by"`
	CreatedAt  time.Time `json:"created_at"`
}

type Approval struct {
	ID           uint       `gorm:"primarykey" json:"id"`
	ProposalID   uint       `json:"proposal_id"`
	ApproverID   uint       `json:"approver_id"`
	Approver     User       `gorm:"foreignKey:ApproverID" json:"approver"`
	ApproverRole UserRole   `json:"approver_role"`
	Status       string     `json:"status"` // pending, approved, rejected
	Comments     string     `gorm:"type:text" json:"comments"`
	ApprovedAt   *time.Time `json:"approved_at"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}

type Comment struct {
	ID         uint      `gorm:"primarykey" json:"id"`
	ProposalID uint      `json:"proposal_id"`
	UserID     uint      `json:"user_id"`
	User       User      `gorm:"foreignKey:UserID" json:"user"`
	Content    string    `gorm:"type:text;not null" json:"content"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
