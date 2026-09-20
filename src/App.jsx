import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Register from './pages/Register';
import Login from './pages/Login';
import VerifyOTP from './pages/VerifyOTP';
import GenerateQuiz from './pages/GenerateQuiz';
import Quiz from './pages/Quiz';
import History from './pages/History';

function Home() {
  return (
    <main className="container">
      <div className="card" style={{ textAlign: 'center', marginTop: 40 }}>
        <h1 style={{ marginBottom: 12, fontSize: 26, color: '#1e293b' }}>React Frontend Ready! 🎉</h1>
        <p style={{ color: '#64748b', fontSize: 16 }}>Vite + React Router + Axios are configured.</p>
      </div>
    </main>
  );
}

function DashboardPlaceholder() {
  return (
    <div className="container">
      <div className="card" style={{ marginTop: 40 }}>
        <h2>Dashboard</h2>
        <p>Protected area. We'll add Generate Quiz UI here next.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPlaceholder /></ProtectedRoute>} />
          <Route path="/generate" element={<ProtectedRoute><GenerateQuiz /></ProtectedRoute>} />
          <Route path="/quiz/:id" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

