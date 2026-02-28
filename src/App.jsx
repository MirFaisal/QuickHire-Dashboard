import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-800">Welcome to QuickHire Dashboard</h1>
              <p className="text-gray-500 mt-2">Select a page from the sidebar</p>
            </div>
          }
        />
        <Route
          path="jobs"
          element={
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-800">Jobs Page (coming next phase)</h1>
            </div>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
