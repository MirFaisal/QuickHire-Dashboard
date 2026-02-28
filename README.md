# QuickHire Admin Dashboard

Admin dashboard for the **QuickHire** job board application. Built with React, Ant Design, Tailwind CSS, and traditional Redux for state management.

## Tech Stack

- **Framework:** React 19 (Vite)
- **UI Library:** Ant Design (antd) + @ant-design/icons
- **Styling:** Tailwind CSS v4
- **State Management:** Redux + React-Redux + Redux-Thunk (traditional — no RTK)
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios with JWT interceptors

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
│   └── DashboardPage.jsx           # Job table + create modal + delete
├── store/
│   ├── types.js                    # Action type constants
│   ├── store.js                    # createStore + applyMiddleware(thunk)
│   ├── reducers/
│   │   ├── authReducer.js          # Auth state (token, isAuthenticated)
│   │   ├── jobReducer.js           # Jobs state (jobs array, loading)
│   │   └── index.js                # combineReducers
│   └── actions/
│       ├── authActions.js          # login / logout thunks
│       └── jobActions.js           # fetchJobs / createJob / deleteJob thunks
└── utils/
    └── api.js                      # Axios instance with JWT interceptors
```

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **QuickHire Backend** API running (see [QuickHire-backend](https://github.com/MirFaisal/QuickHire-backend))

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
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

| Variable       | Description                    | Example                         |
| -------------- | ------------------------------ | ------------------------------- |
| `VITE_API_URL` | Backend API base URL           | `http://localhost:5000/api`     |

## Features

- **JWT Authentication** — Login form dispatches credentials to backend, stores token in localStorage
- **Protected Routes** — Unauthenticated users are redirected to `/login`
- **Admin Layout** — Collapsible sidebar (Dashboard, Jobs), header with logout button
- **Job Table** — Ant Design Table displaying all jobs with title, company, category, location
- **Create Job** — Modal with form to add new job listings
- **Delete Job** — Popconfirm dialog before deleting a job
- **401 Interceptor** — Automatically logs out and redirects on expired/invalid token

## Author

**Mir Faisal Ahmad**
