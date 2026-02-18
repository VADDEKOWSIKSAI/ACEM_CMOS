import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && !user.roles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
};

import { CartProvider } from './context/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                path="/student/*"
                element={
                  <PrivateRoute role="STUDENT">
                    <StudentDashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin/*"
                element={
                  <PrivateRoute role="ADMIN">
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />

              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
