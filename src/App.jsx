import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Leads from './pages/Leads.jsx';
import LeadDetail from './pages/LeadDetail.jsx';
import LeadForm from './pages/LeadForm.jsx';
import ActivityForm from './pages/ActivityForm.jsx';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Navigate to="/dashboard" replace />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads"
          element={
            <ProtectedRoute>
              <Layout>
                <Leads />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads/new"
          element={
            <ProtectedRoute>
              <Layout>
                <LeadForm />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <LeadDetail />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads/:leadId/activity"
          element={
            <ProtectedRoute>
              <Layout>
                <ActivityForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;


