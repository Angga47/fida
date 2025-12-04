package handlers

import (
	"fmt"
	"fui-backend/database"
	"fui-backend/models"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
)

type ProposalHandler struct{}

func NewProposalHandler() *ProposalHandler {
	return &ProposalHandler{}
}

type CreateProposalRequest struct {
	Title               string    `json:"title"`
	Description         string    `json:"description"`
	InvestmentType      string    `json:"investment_type"`
	EstimatedCost       float64   `json:"estimated_cost"`
	Currency            string    `json:"currency"`
	ExpectedStartDate   time.Time `json:"expected_start_date"`
	ExpectedCompletDate time.Time `json:"expected_complete_date"`
	Justification       string    `json:"justification"`
	ExpectedBenefit     string    `json:"expected_benefit"`
	RiskAnalysis        string    `json:"risk_analysis"`
	DepartmentID        string    `json:"department_id"`
}

func (h *ProposalHandler) CreateProposal(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)
	
	var req CreateProposalRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	if req.Title == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "title is required",
		})
	}

	db := database.GetDB()

	// Generate proposal number
	proposalNumber := fmt.Sprintf("INV-%s-%d", time.Now().Format("200601"), time.Now().Unix())

	proposal := models.InvestmentProposal{
		ProposalNumber:      proposalNumber,
		Title:               req.Title,
		Description:         req.Description,
		InvestmentType:      req.InvestmentType,
		EstimatedCost:       req.EstimatedCost,
		Currency:            req.Currency,
		ProposalDate:        time.Now(),
		ExpectedStartDate:   req.ExpectedStartDate,
		ExpectedCompletDate: req.ExpectedCompletDate,
		Justification:       req.Justification,
		ExpectedBenefit:     req.ExpectedBenefit,
		RiskAnalysis:        req.RiskAnalysis,
		Status:              models.StatusDraft,
		SubmittedByID:       userID,
		DepartmentID:        req.DepartmentID,
	}

	if err := db.Create(&proposal).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "failed to create proposal",
		})
	}

	// Load relations
	db.Preload("SubmittedBy").First(&proposal, proposal.ID)

	return c.Status(fiber.StatusCreated).JSON(proposal)
}

func (h *ProposalHandler) GetProposals(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)
	role := c.Locals("role").(models.UserRole)

	db := database.GetDB()
	var proposals []models.InvestmentProposal

	query := db.Preload("SubmittedBy").Preload("Approvals.Approver")

	// Filter based on role
	if role != models.RoleAdmin && role != models.RoleCEO && role != models.RoleCFO {
		// Regular users only see their own proposals
		query = query.Where("submitted_by_id = ?", userID)
	}

	// Add filters from query params
	if status := c.Query("status"); status != "" {
		query = query.Where("status = ?", status)
	}

	if err := query.Order("created_at DESC").Find(&proposals).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "failed to fetch proposals",
		})
	}

	return c.JSON(proposals)
}

func (h *ProposalHandler) GetProposal(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid proposal id",
		})
	}

	userID := c.Locals("user_id").(uint)
	role := c.Locals("role").(models.UserRole)

	db := database.GetDB()
	var proposal models.InvestmentProposal

	query := db.Preload("SubmittedBy").
		Preload("Attachments").
		Preload("Approvals.Approver").
		Preload("Comments.User")

	if err := query.First(&proposal, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "proposal not found",
		})
	}

	// Check access permissions
	if role != models.RoleAdmin && role != models.RoleCEO && role != models.RoleCFO {
		if proposal.SubmittedByID != userID {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "access denied",
			})
		}
	}

	return c.JSON(proposal)
}

func (h *ProposalHandler) UpdateProposal(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid proposal id",
		})
	}

	userID := c.Locals("user_id").(uint)

	var req CreateProposalRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	db := database.GetDB()
	var proposal models.InvestmentProposal

	if err := db.First(&proposal, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "proposal not found",
		})
	}

	// Check ownership
	if proposal.SubmittedByID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "access denied",
		})
	}

	// Can only edit draft or revision status
	if proposal.Status != models.StatusDraft && proposal.Status != models.StatusRevision {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "cannot edit proposal in current status",
		})
	}

	// Update fields
	proposal.Title = req.Title
	proposal.Description = req.Description
	proposal.InvestmentType = req.InvestmentType
	proposal.EstimatedCost = req.EstimatedCost
	proposal.Currency = req.Currency
	proposal.ExpectedStartDate = req.ExpectedStartDate
	proposal.ExpectedCompletDate = req.ExpectedCompletDate
	proposal.Justification = req.Justification
	proposal.ExpectedBenefit = req.ExpectedBenefit
	proposal.RiskAnalysis = req.RiskAnalysis
	proposal.DepartmentID = req.DepartmentID

	if err := db.Save(&proposal).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "failed to update proposal",
		})
	}

	db.Preload("SubmittedBy").First(&proposal, proposal.ID)

	return c.JSON(proposal)
}

func (h *ProposalHandler) DeleteProposal(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid proposal id",
		})
	}

	userID := c.Locals("user_id").(uint)
	role := c.Locals("role").(models.UserRole)

	db := database.GetDB()
	var proposal models.InvestmentProposal

	if err := db.First(&proposal, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "proposal not found",
		})
	}

	// Check permissions
	if role != models.RoleAdmin && proposal.SubmittedByID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "access denied",
		})
	}

	// Can only delete draft proposals
	if proposal.Status != models.StatusDraft {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "can only delete draft proposals",
		})
	}

	if err := db.Delete(&proposal).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "failed to delete proposal",
		})
	}

	return c.JSON(fiber.Map{
		"message": "proposal deleted successfully",
	})
}

func (h *ProposalHandler) SubmitProposal(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid proposal id",
		})
	}

	userID := c.Locals("user_id").(uint)

	db := database.GetDB()
	var proposal models.InvestmentProposal

	if err := db.First(&proposal, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "proposal not found",
		})
	}

	if proposal.SubmittedByID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "access denied",
		})
	}

	if proposal.Status != models.StatusDraft && proposal.Status != models.StatusRevision {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "proposal already submitted",
		})
	}

	proposal.Status = models.StatusSubmitted
	if err := db.Save(&proposal).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "failed to submit proposal",
		})
	}

	return c.JSON(proposal)
}

func (h *ProposalHandler) AddComment(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid proposal id",
		})
	}

	userID := c.Locals("user_id").(uint)

	var req struct {
		Content string `json:"content"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	if req.Content == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "content is required",
		})
	}

	db := database.GetDB()
	
	// Check if proposal exists
	var proposal models.InvestmentProposal
	if err := db.First(&proposal, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "proposal not found",
		})
	}

	comment := models.Comment{
		ProposalID: uint(id),
		UserID:     userID,
		Content:    req.Content,
	}

	if err := db.Create(&comment).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "failed to add comment",
		})
	}

	db.Preload("User").First(&comment, comment.ID)

	return c.Status(fiber.StatusCreated).JSON(comment)
}
