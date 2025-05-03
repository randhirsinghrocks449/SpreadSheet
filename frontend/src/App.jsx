import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup'; // Corrected to Spreadsheet
import { AuthProvider } from './context/authContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoutes';
import Spreadsheet from './components/spreadsheet/spreadsheet';
import Dashboard from './components/spreadsheet/Dashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          <Route element={<ProtectedRoute />}>
            <Route path="/spreadsheet" element={<Spreadsheet />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
