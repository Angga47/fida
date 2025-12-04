# ✅ Masalah Sudah Diperbaiki

## 1. ❌ Error CGO_ENABLED - SOLVED ✅

**Error yang muncul:**

```
Binary was compiled with 'CGO_ENABLED=0', go-sqlite3 requires cgo to work
```

**Solusi:**
Driver SQLite telah diubah dari `gorm.io/driver/sqlite` (memerlukan CGO) ke `github.com/glebarez/sqlite` (pure Go, tidak memerlukan CGO).

**File yang diubah:**

- `backend/go.mod` - Mengganti dependency
- `backend/database/database.go` - Mengubah import statement

**Cara verifikasi:**

```bash
cd backend
go mod tidy
go build -o fui-backend.exe
```

Jika berhasil build tanpa error, masalah sudah teratasi.

---

## 2. ❌ Port 8080 Conflict - SOLVED ✅

**Masalah:**
Port 8080 sudah digunakan oleh Apache di sistem Anda.

**Solusi:**
Backend sekarang menggunakan port **8081** sebagai gantinya.

**File yang diubah:**

- `backend/.env` - PORT=8081
- `backend/.env.example` - PORT=8081
- `frontend/.env.local` - NEXT_PUBLIC_API_URL=http://localhost:8081/api
- `start-backend.ps1` - Updated info
- `start-backend.bat` - Updated info
- `QUICKSTART.md` - Updated dokumentasi

**Akses aplikasi:**

- Backend API: http://localhost:8081
- Backend Health: http://localhost:8081/health
- Frontend: http://localhost:3000

---

## 3. ❌ npm Execution Policy - SOLVED ✅

**Error yang muncul:**

```
npm.ps1 cannot be loaded because running scripts is disabled
```

**Solusi:**
Execution policy telah diubah dengan command:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Cara verifikasi:**

```bash
npm --version
```

Jika menampilkan versi npm, masalah sudah teratasi.

---

## 🚀 Cara Menjalankan Aplikasi (UPDATED)

### Opsi 1: Menggunakan Script (Recommended)

Buka 2 terminal PowerShell:

**Terminal 1 - Backend:**

```powershell
cd "d:\Data Angga\program\fui"
.\start-backend.ps1
```

**Terminal 2 - Frontend:**

```powershell
cd "d:\Data Angga\program\fui"
.\start-frontend.ps1
```

### Opsi 2: Manual

**Backend:**

```bash
cd "d:\Data Angga\program\fui\backend"
go mod tidy
go run main.go
```

**Frontend:**

```bash
cd "d:\Data Angga\program\fui\frontend"
npm install
npm run dev
```

---

## ✅ Checklist Verifikasi

- [x] CGO error diperbaiki (menggunakan pure Go SQLite driver)
- [x] Port conflict diperbaiki (backend sekarang di port 8081)
- [x] npm execution policy diperbaiki
- [x] Dependencies backend terinstall (go mod tidy)
- [x] Dependencies frontend terinstall (npm install)
- [x] Backend berhasil build tanpa error
- [x] Script startup diupdate
- [x] Dokumentasi diupdate

---

## 📝 Catatan Penting

1. **SQLite Database**: Database akan otomatis dibuat di `backend/database.db` saat pertama kali aplikasi dijalankan.

2. **LDAP Connection**: Pastikan Anda terhubung ke jaringan internal Mitra Keluarga untuk dapat login. LDAP server di `10.101.32.9:389` harus dapat diakses.

3. **First Login**: User pertama kali login akan didaftarkan dengan role default "Corp FA". Admin dapat mengubah role di database.

4. **Port yang Digunakan**:
   - Backend: 8081 (bukan 8080 lagi)
   - Frontend: 3000
   - Apache: 8080 (tetap berjalan, tidak diganggu)

---

## 🔧 Troubleshooting Tambahan

### Backend tidak start

```powershell
# Cek apakah ada error
cd backend
go run main.go
```

### Frontend tidak start

```powershell
# Hapus node_modules dan reinstall
cd frontend
Remove-Item -Recurse -Force node_modules
npm install
npm run dev
```

### Cek apakah port sudah listening

```powershell
# Backend (port 8081)
Test-NetConnection localhost -Port 8081

# Frontend (port 3000)
Test-NetConnection localhost -Port 3000
```

### Test backend API

```powershell
# Health check
Invoke-RestMethod -Uri "http://localhost:8081/health"

# Harus return: {"status":"ok","message":"FUI Backend API is running"}
```

---

## 🎉 Selamat!

Semua masalah sudah diperbaiki. Aplikasi siap digunakan!

Silakan jalankan backend dan frontend, lalu akses:
👉 **http://localhost:3000**
