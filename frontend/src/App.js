import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {NextUIProvider} from '@nextui-org/react';
import './App.css';

// Auth Provider
import { AuthProvider } from './context/AuthContext';
// Theme Provider

// Components
import MainNavbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import ProblemPage from './components/dashboard/ProblemPage';
import ProblemsList from './components/dashboard/ProblemsList';
import PrivateRoute from './components/routing/PrivateRoute';
import Profile from './components/dashboard/Profile';

const App = () => {
  return (
      <NextUIProvider>
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
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
      </NextUIProvider>
    
  );
};

export default App;
