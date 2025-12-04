# Form Usulan Investasi - Frontend

Frontend aplikasi Form Usulan Investasi menggunakan Next.js dengan TypeScript dan Tailwind CSS.

## Features

- 🔐 Login dengan LDAP Authentication
- 📊 Dashboard dengan statistik proposal
- 📝 CRUD Form Usulan Investasi
- 👥 Role-Based Access Control
- 🎨 Modern UI dengan Tailwind CSS
- 📱 Responsive Design
- 🔄 Real-time Updates

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Axios (HTTP Client)
- Zustand (State Management)
- Lucide React (Icons)
- React Hook Form

## Installation

1. Install dependencies:

```bash
npm install
```

2. Copy environment file:

```bash
copy .env.local.example .env.local
```

3. Update `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

4. Run development server:

```bash
npm run dev
```

Application akan berjalan di `http://localhost:3000`

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── login/           # Login page
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # Reusable components
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   ├── services/            # API services
│   │   ├── auth.service.ts
│   │   └── proposal.service.ts
│   ├── store/               # Zustand stores
│   │   └── authStore.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   └── lib/                 # Utilities
│       └── axios.ts
├── public/                  # Static files
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Pages

### Public Pages

- `/login` - Login page dengan LDAP authentication

### Protected Pages (Requires Authentication)

- `/dashboard` - Dashboard utama dengan statistik
- `/dashboard/proposals` - Daftar usulan investasi
- `/dashboard/proposals/new` - Form buat usulan baru
- `/dashboard/proposals/[id]` - Detail usulan
- `/dashboard/proposals/[id]/edit` - Edit usulan

### Admin Only Pages

- `/dashboard/users` - Kelola user
- `/dashboard/settings` - Pengaturan aplikasi

## Features Detail

### Authentication

- Login menggunakan LDAP credentials
- JWT token untuk authorization
- Auto-redirect jika tidak authenticated
- Session management dengan Zustand

### Dashboard

- Statistik usulan (Total, Draft, Submitted, Approved, Rejected)
- Daftar semua usulan investasi
- Filter berdasarkan status
- Quick action untuk membuat usulan baru

### Usulan Investasi

- Create, Read, Update, Delete proposal
- Submit proposal untuk approval
- Add comments
- View approval history
- Upload attachments (future feature)

### Role-Based Access

- **Corp FA**: Membuat dan manage usulan sendiri
- **Direktur**: Review dan approve usulan
- **CEO/CFO**: Final approval
- **Sourcing dan Procurement**: Review usulan
- **Admin**: Full access ke semua fitur

## API Integration

Backend API endpoint: `http://localhost:8080/api`

### Authentication

- `POST /auth/login` - Login
- `GET /auth/profile` - Get user profile
- `POST /auth/logout` - Logout

### Proposals

- `GET /proposals` - Get all proposals
- `POST /proposals` - Create proposal
- `GET /proposals/:id` - Get proposal detail
- `PUT /proposals/:id` - Update proposal
- `DELETE /proposals/:id` - Delete proposal
- `POST /proposals/:id/submit` - Submit proposal
- `POST /proposals/:id/comments` - Add comment

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Styling

Aplikasi menggunakan Tailwind CSS dengan custom theme:

```js
colors: {
  primary: {
    50: '#f0f9ff',
    // ... other shades
    900: '#0c4a6e',
  },
}
```

## State Management

Zustand untuk global state management:

- **authStore**: User authentication state
  - user: Current user object
  - token: JWT token
  - isAuthenticated: Boolean
  - setUser, setToken, logout, initialize

## License

MIT
