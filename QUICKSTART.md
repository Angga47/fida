# 🚀 Quick Start Guide

## Cara Menjalankan Aplikasi

### Opsi 1: Menggunakan Script (Recommended)

#### Windows (Command Prompt):

```cmd
# Terminal 1 - Backend
start-backend.bat

# Terminal 2 - Frontend (buka terminal baru)
start-frontend.bat
```

#### Windows (PowerShell):

```powershell
# Terminal 1 - Backend
.\start-backend.ps1

# Terminal 2 - Frontend (buka terminal baru)
.\start-frontend.ps1
```

### Opsi 2: Manual

#### Backend:

```bash
cd backend
go mod tidy
go run main.go
```

#### Frontend:

```bash
cd frontend
npm install
npm run dev
```

## 🌐 Akses Aplikasi

Setelah kedua server berjalan:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8081
- **Health Check**: http://localhost:8081/health

> **Note**: Backend menggunakan port 8081 karena port 8080 sudah digunakan oleh Apache.

## 🔐 Login

Gunakan credentials LDAP Anda untuk login:

- **Username**: username Active Directory Anda
- **Password**: password Active Directory Anda

## ⚠️ Troubleshooting

### Error: "npm cannot be loaded because running scripts is disabled"

Jalankan di PowerShell (sebagai Administrator):

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error: "Cannot find path frontend"

Pastikan Anda berada di folder `fui`, bukan di `fui\backend`:

```bash
cd d:\Data Angga\program\fui
```

### Backend tidak bisa connect ke LDAP

1. Pastikan Anda terhubung ke jaringan internal Mitra Keluarga
2. Cek file `.env` di folder backend
3. Verifikasi LDAP server dapat diakses: `Test-NetConnection 10.101.32.9 -Port 389`

### Port sudah digunakan

Jika port 8081 atau 3000 sudah digunakan:

**Windows:**

```powershell
# Cari process yang menggunakan port
Get-NetTCPConnection -LocalPort 8081 | Select-Object OwningProcess

# Kill process (ganti PID dengan process ID yang ditemukan)
Stop-Process -Id PID -Force
```

### Backend Error: CGO_ENABLED

Jika muncul error tentang CGO, driver SQLite sudah diubah ke pure Go version (glebarez/sqlite) yang tidak memerlukan CGO.

## 📝 Default User Role

Saat pertama kali login, user akan didaftarkan dengan role **"Corp FA"**.

Admin dapat mengubah role user melalui database atau akan ada menu admin untuk manage user roles.

## 💡 Tips

1. Selalu jalankan backend terlebih dahulu sebelum frontend
2. Gunakan browser dalam mode **incognito** untuk testing login yang clean
3. Cek console browser (F12) jika ada error di frontend
4. Cek terminal backend untuk melihat log API requests

## 🆘 Need Help?

Jika masih ada masalah:

1. Cek file `README.md` di folder backend dan frontend
2. Lihat error message di terminal
3. Cek browser console (F12) untuk error frontend
