# MoneyMate 💰 - Financial Management Application

MoneyMate adalah aplikasi pengelolaan keuangan modern yang dirancang untuk membantu pengguna melacak pemasukan, pengeluaran, anggaran, dan tabungan secara real-time. Proyek ini mencakup **Backend Express API**, **Frontend Admin Web (React)**, dan **Mobile User Application (Flutter)**.

---

## 📁 Structure Directory Overview

```text
MoneyMate/
│
├── FE/                         # Frontend Website Admin (React + TypeScript + Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI Components (StatCard, Sidebar, Modal)
│   │   ├── pages/              # Admin Pages (Dashboard, Transactions, Budgets)
│   │   ├── layouts/            # Layout Wrappers (AdminLayout)
│   │   ├── routes/             # Client Routing (AppRoutes)
│   │   ├── services/           # Axios / Fetch API Services
│   │   ├── models/             # TypeScript Models & Interfaces
│   │   ├── utils/              # Formatting (Rupiah, Dates)
│   │   ├── assets/             # Images, Styles
│   │   ├── App.tsx             # Main App Component
│   │   └── main.tsx            # DOM Entry Point
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
├── MOBILE/                    # Aplikasi Mobile User (Flutter / Dart)
│   ├── lib/
│   │   ├── screens/            # Screens (HomeScreen, TransactionScreen, BudgetScreen)
│   │   ├── widgets/            # Custom Widgets (BalanceCard, RecentActivity)
│   │   ├── navigation/         # Navigation Router
│   │   ├── services/           # HTTP API Service
│   │   ├── models/             # Dart Domain Models
│   │   ├── utils/              # Currency & Helper Functions
│   │   └── main.dart           # App Entry Point
│   ├── assets/
│   ├── test/
│   └── pubspec.yaml
│
├── BE/                        # Backend / API (Node.js + Express + TypeScript)
│   ├── controllers/            # Request Handlers
│   ├── routes/                 # API Endpoint Definitions
│   ├── services/               # Business Logic Layer
│   ├── models/                 # Data Schemas & Mock Data DB
│   ├── utils/                  # Helper Utilities (Response Formatters)
│   ├── config/                 # Environment & Server Config
│   ├── .env                    # Environment Variables
│   ├── package.json
│   └── server.ts               # Server Entry Point
│
├── docs/
│   ├── ERD.md                  # Entity Relationship Diagram
│   ├── API.md                  # Complete API Documentation
│   └── FLOW.md                 # User & Admin System Flowcharts
│
├── .gitignore
├── README.md
└── package.json
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **npm** or **yarn**
- **Flutter SDK** (optional for MOBILE app)

### 2. Running Backend (BE)
```bash
cd BE
npm install
npm run dev
```
Server run at: `http://localhost:5000`

### 3. Running Frontend Admin (FE)
```bash
cd FE
npm install
npm run dev
```
Web App run at: `http://localhost:3000`

### 4. Running Mobile App (MOBILE)
```bash
cd MOBILE
flutter pub get
flutter run
```

---

## 📄 Documentation Links
- 📐 [Entity Relationship Diagram (ERD)](docs/ERD.md)
- 🔌 [REST API Specifications](docs/API.md)
- 🔄 [System & Application Flow](docs/FLOW.md)
