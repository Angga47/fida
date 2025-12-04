# Form Usulan Investasi (FUI)

Aplikasi Form Usulan Investasi untuk Mitra Keluarga dengan autentikasi LDAP, backend Go Fiber, dan frontend Next.js.

## 📋 Deskripsi

Aplikasi ini memungkinkan karyawan untuk mengajukan usulan investasi yang kemudian dapat direview dan diapprove oleh manajemen berdasarkan role masing-masing.

## 🏗️ Arsitektur

```
fui/
├── backend/         # Go Fiber REST API
│   ├── config/
│   ├── database/
│   ├── handlers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── main.go
│
└── frontend/        # Next.js 14 App
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── services/
    │   ├── store/
    │   ├── types/
    │   └── lib/
    └── public/
```

## 🚀 Tech Stack

### Backend

- **Go 1.21+**
- **Fiber v2** - Web framework
- **GORM** - ORM
- **SQLite** - Database
- **LDAP v3** - Authentication
- **JWT** - Authorization

### Frontend

- **Next.js 14** - React framework (App Router)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Axios** - HTTP client
- **Lucide React** - Icons

## 👥 User Roles

1. **Admin** - Full access
2. **Corp FA** - Financial Analyst
3. **Direktur** - Director approval
4. **CEO** - Chief Executive Officer approval
5. **CFO** - Chief Financial Officer approval
6. **Sourcing dan Procurement** - Procurement review

## 🔧 Instalasi

### Prerequisites

- Go 1.21 atau lebih baru
- Node.js 18 atau lebih baru
- npm atau yarn

### Backend Setup

1. Masuk ke folder backend:

```bash
cd backend
```

2. Install dependencies:

```bash
go mod download
```

3. Copy file environment:

```bash
copy .env.example .env
```

4. Edit `.env` sesuai konfigurasi Anda:

```env
PORT=8080
DB_PATH=./database.db

LDAP_SERVER=10.101.32.9
LDAP_PORT=389
LDAP_BASE_DN=DC=mitrakeluarga,DC=com
LDAP_BIND_USERNAME=admldap@mitrakeluarga.com
LDAP_BIND_PASSWORD=Prenagen2020!

JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRY_HOURS=24

FRONTEND_URL=http://localhost:3000
```

5. Jalankan aplikasi:

```bash
go run main.go
```

Backend akan berjalan di `http://localhost:8080`

### Frontend Setup

1. Masuk ke folder frontend:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Copy file environment:

```bash
copy .env.local.example .env.local
```

4. Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

5. Jalankan development server:

```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

## 📖 Cara Menggunakan

### 1. Login

- Buka browser ke `http://localhost:3000`
- Login menggunakan credentials LDAP Anda
- Username dan password sesuai akun Active Directory

### 2. Dashboard

Setelah login, Anda akan melihat:

- Statistik usulan (Total, Draft, Submitted, Approved, Rejected)
- Daftar usulan investasi yang pernah dibuat
- Tombol untuk membuat usulan baru

### 3. Membuat Usulan Investasi

1. Klik tombol **"Buat Usulan Baru"**
2. Isi form dengan lengkap:
   - Judul usulan
   - Deskripsi
   - Jenis investasi
   - Estimasi biaya
   - Tanggal mulai dan selesai
   - Justifikasi
   - Manfaat yang diharapkan
   - Analisis risiko
3. Klik **"Simpan sebagai Draft"** atau **"Submit"**

### 4. Melihat Detail Usulan

- Klik pada usulan di daftar
- Lihat detail lengkap
- Tambahkan komentar jika diperlukan
- Edit atau hapus usulan (hanya untuk status draft)

### 5. Approval Process (untuk Approver)

- Direktur, CEO, CFO dapat melihat usulan yang disubmit
- Review detail usulan
- Approve atau reject dengan komentar

## 🔐 LDAP Configuration

Aplikasi menggunakan LDAP untuk autentikasi:

- **Server**: 10.101.32.9:389
- **Base DN**: DC=mitrakeluarga,DC=com
- **Bind User**: admldap@mitrakeluarga.com

User yang berhasil login akan otomatis didaftarkan ke database dengan default role "Corp FA". Admin dapat mengubah role melalui dashboard admin.

## 📊 Database Schema

### Users

- ID, Username, Email, FullName
- Role, Department
- IsActive, LastLoginAt

### InvestmentProposal

- ProposalNumber, Title, Description
- InvestmentType, EstimatedCost, Currency
- Dates, Justification, ExpectedBenefit, RiskAnalysis
- Status, SubmittedBy

### Attachment

- FileName, FilePath, FileSize, FileType

### Approval

- ApproverID, Status, Comments, ApprovedAt

### Comment

- UserID, Content

## 🔄 API Endpoints

### Authentication

- `POST /api/auth/login` - Login dengan LDAP
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - Logout

### Proposals

- `GET /api/proposals` - Get all proposals
- `POST /api/proposals` - Create proposal
- `GET /api/proposals/:id` - Get detail
- `PUT /api/proposals/:id` - Update proposal
- `DELETE /api/proposals/:id` - Delete proposal
- `POST /api/proposals/:id/submit` - Submit proposal
- `POST /api/proposals/:id/comments` - Add comment

### Admin

- `GET /api/admin/users` - Get all users (admin only)

### Health Check

- `GET /health` - Check API status

## 🏗️ Build for Production

### Backend

```bash
cd backend
go build -o fui-backend.exe
./fui-backend.exe
```

### Frontend

```bash
cd frontend
npm run build
npm start
```

## 🐛 Troubleshooting

### Backend tidak bisa connect ke LDAP

- Pastikan server LDAP dapat diakses dari network Anda
- Cek firewall settings
- Verifikasi credentials LDAP di file `.env`

### Frontend tidak bisa connect ke Backend

- Pastikan backend sudah running di port 8080
- Cek CORS settings di backend
- Verifikasi `NEXT_PUBLIC_API_URL` di `.env.local`

### Database error

- Pastikan folder backend dapat ditulis (untuk SQLite)
- Cek permission file `database.db`

## 📝 TODO / Future Features

- [ ] File upload untuk attachments
- [ ] Email notification untuk approval
- [ ] Advanced reporting dan analytics
- [ ] Export to PDF/Excel
- [ ] Multi-level approval workflow
- [ ] Audit trail
- [ ] Mobile app

## 👨‍💻 Development

### Backend Development

```bash
cd backend
go run main.go
```

### Frontend Development

```bash
cd frontend
npm run dev
```

### Testing

Backend:

```bash
cd backend
go test ./...
```

Frontend:

```bash
cd frontend
npm run test
```

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

Untuk bantuan, silakan hubungi:

- IT Department Mitra Keluarga
- Email: it@mitrakeluarga.com
