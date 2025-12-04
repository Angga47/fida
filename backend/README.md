# Form Usulan Investasi - Backend

Backend API untuk aplikasi Form Usulan Investasi menggunakan Go Fiber dengan autentikasi LDAP.

## Features

- 🔐 Autentikasi LDAP
- 🔑 JWT Token Authentication
- 📝 CRUD Form Usulan Investasi
- 👥 Role-Based Access Control (admin, Corp FA, Direktur, CEO, CFO, Sourcing dan Procurement)
- 💾 SQLite Database
- 📎 File Attachments Support
- 💬 Comments System
- ✅ Approval Workflow

## Tech Stack

- Go 1.21+
- Fiber v2 (Web Framework)
- GORM (ORM)
- SQLite (Database)
- LDAP v3 (Authentication)
- JWT (Authorization)

## Installation

1. Install dependencies:

```bash
go mod download
```

2. Copy environment file:

```bash
copy .env.example .env
```

3. Update `.env` with your configuration

4. Run the application:

```bash
go run main.go
```

Server akan berjalan di `http://localhost:8080`

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login dengan LDAP credentials
- `GET /api/auth/profile` - Get current user profile (protected)
- `POST /api/auth/logout` - Logout (protected)

### Proposals

- `GET /api/proposals` - Get all proposals (protected)
- `POST /api/proposals` - Create new proposal (protected)
- `GET /api/proposals/:id` - Get proposal detail (protected)
- `PUT /api/proposals/:id` - Update proposal (protected)
- `DELETE /api/proposals/:id` - Delete proposal (protected)
- `POST /api/proposals/:id/submit` - Submit proposal for approval (protected)
- `POST /api/proposals/:id/comments` - Add comment to proposal (protected)

### Admin

- `GET /api/admin/users` - Get all users (admin only)

### Health Check

- `GET /health` - Check API status

## Environment Variables

```env
PORT=8080
APP_ENV=development

# Database
DB_PATH=./database.db

# LDAP Configuration
LDAP_SERVER=10.101.32.9
LDAP_PORT=389
LDAP_BASE_DN=DC=mitrakeluarga,DC=com
LDAP_BIND_USERNAME=admldap@mitrakeluarga.com
LDAP_BIND_PASSWORD=Prenagen2020!

# JWT
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRY_HOURS=24

# CORS
FRONTEND_URL=http://localhost:3000
```

## Project Structure

```
backend/
├── config/          # Configuration
├── database/        # Database connection & migration
├── handlers/        # HTTP handlers
├── middleware/      # Middleware functions
├── models/          # Database models
├── routes/          # Route definitions
├── services/        # Business logic services
├── main.go          # Application entry point
├── go.mod           # Go dependencies
└── .env             # Environment variables
```

## Database Models

### User

- ID, Username, Email, FullName
- Role (admin, Corp FA, Direktur, CEO, CFO, Sourcing dan Procurement)
- Department, IsActive, LastLoginAt

### InvestmentProposal

- ProposalNumber, Title, Description
- InvestmentType, EstimatedCost, Currency
- Dates (ProposalDate, ExpectedStartDate, ExpectedCompletDate)
- Justification, ExpectedBenefit, RiskAnalysis
- Status (draft, submitted, reviewing, approved, rejected, revision)
- Relations: SubmittedBy, Attachments, Approvals, Comments

### Attachment

- FileName, FilePath, FileSize, FileType

### Approval

- ApproverID, ApproverRole, Status, Comments, ApprovedAt

### Comment

- UserID, Content, Timestamps

## Development

### Run in development mode:

```bash
go run main.go
```

### Build for production:

```bash
go build -o fui-backend.exe
```

### Run tests:

```bash
go test ./...
```

## License

MIT
