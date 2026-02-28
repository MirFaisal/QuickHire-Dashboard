# QuickHire Admin Dashboard

Admin dashboard for the **QuickHire** job board application. Built with React, Ant Design, Tailwind CSS, and
traditional Redux for state management.

## Tech Stack

- **Framework:** React 19 (Vite 7)
- **UI Library:** Ant Design 6 + @ant-design/icons
- **Styling:** Tailwind CSS v4
- **State Management:** Redux + React-Redux + Redux-Thunk (traditional — no RTK)
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios with JWT interceptors

## Features

- **JWT Authentication** — Login form dispatches credentials to backend, stores token in localStorage
- **Protected Routes** — Unauthenticated users are redirected to `/login`
- **Admin Layout** — Collapsible sidebar (Dashboard, Jobs, Categories, Applications), header with logout
  button
- **Dashboard Overview** — Summary statistics page
- **Jobs Management** — Table with create, soft-delete, and restore; Active/Deleted tabs
- **Categories Management** — Table with create, soft-delete, and restore; Active/Deleted tabs
- **Applications Management** — Table with soft-delete and restore; Active/Deleted tabs
- **Soft Delete & Restore** — All modules support soft delete with a separate "Deleted" tab to view and
  restore records
- **401 Interceptor** — Automatically logs out and redirects on expired/invalid token

## Project Structure

```
src/
├── main.jsx                        # Entry point (Provider + BrowserRouter)
├── App.jsx                         # Route definitions
├── index.css                       # Tailwind CSS import
├── components/
│   ├── AdminLayout.jsx             # Layout with collapsible Sider + Header
│   └── ProtectedRoute.jsx          # Auth guard (redirects to /login)
├── pages/
│   ├── LoginPage.jsx               # Ant Design login form
│   ├── DashboardPage.jsx           # Overview / statistics page
│   ├── JobsPage.jsx                # Jobs table + create modal + Active/Deleted tabs
│   ├── CategoryPage.jsx            # Categories table + create modal + Active/Deleted tabs
│   └── ApplicationsPage.jsx        # Applications table + Active/Deleted tabs
├── store/
│   ├── types.js                    # Action type constants (all modules)
│   ├── store.js                    # createStore + applyMiddleware(thunk)
│   ├── reducers/
│   │   ├── authReducer.js          # Auth state (token, isAuthenticated)
│   │   ├── jobReducer.js           # Jobs state (jobs array, deletedJobs, loading)
│   │   ├── categoryReducer.js      # Categories state (categories, deletedCategories, loading)
│   │   ├── applicationReducer.js   # Applications state (applications, deletedApplications, loading)
│   │   └── index.js                # combineReducers
│   └── actions/
│       ├── authActions.js          # login / logout thunks
│       ├── jobActions.js           # fetchJobs / createJob / deleteJob / fetchDeletedJobs / restoreJob
│       ├── categoryActions.js      # fetchCategories / createCategory / deleteCategory / fetchDeletedCategories / restoreCategory
│       └── applicationActions.js   # fetchApplications / deleteApplication / fetchDeletedApplications / restoreApplication
└── utils/
    └── api.js                      # Axios instance with JWT interceptors
```

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **QuickHire Backend** API running — [deployed](https://quickhire-backend-xs81.onrender.com) or locally (see
  [QuickHire-backend](https://github.com/MirFaisal/QuickHire-backend))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/MirFaisal/QuickHire-Dashboard.git
cd QuickHire-Dashboard

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Edit .env with your backend API URL (see below)

# 4. Start the development server
npm run dev
```

The app will start at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

## Environment Variables

Create a `.env` file in the project root:

| Variable       | Description          | Example                                           |
| -------------- | -------------------- | ------------------------------------------------- |
| `VITE_API_URL` | Backend API base URL | `https://quickhire-backend-xs81.onrender.com/api` |

> For local development, use `http://localhost:5000/api` instead.

## Default Admin Credentials

The backend ships with a seeded admin account. Use these credentials to log in:

| Field    | Value                 |
| -------- | --------------------- |
| Email    | `admin@quickhire.com` |
| Password | `Admin@123`           |

> To seed the admin account, run `npm run seed` in the backend project.

## Author

**Mir Faisal Ahmad**
