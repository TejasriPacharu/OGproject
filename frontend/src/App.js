import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Auth Provider
import { AuthProvider } from './context/AuthContext';

// Components
import MainNavbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import ProblemPage from './components/dashboard/ProblemPage';
import ProblemsList from './components/dashboard/ProblemsList';
import PrivateRoute from './components/routing/PrivateRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <MainNavbar />
          <main>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/problems" element={<PrivateRoute><ProblemsList /></PrivateRoute>} />
              <Route path="/problems/:id" element={<PrivateRoute><ProblemPage /></PrivateRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
