import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import PlantsList from './pages/PlantsList';
import AddPlant from './pages/AddPlant';
import EditPlant from './pages/EditPlant';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SocialFeed from './pages/SocialFeed';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated, logout as logoutUser, getCurrentUser } from './utils/auth';

function Navigation() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = isAuthenticated();
      setAuthenticated(authStatus);
      
      if (authStatus) {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData);
        } else {
          setAuthenticated(false);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();
    
    // Check auth on storage changes (login/logout from other tabs)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-emerald-700 to-teal-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-white">🌱 Terrace Club</Link>
          <div className="flex space-x-6 items-center">
            <Link to="/" className="text-white hover:text-emerald-200 transition-colors duration-200 font-medium">Home</Link>
            <Link to="/feed" className="text-white hover:text-emerald-200 transition-colors duration-200 font-medium">Social Feed</Link>
            {authenticated ? (
              <>
                <Link to="/plants" className="text-white hover:text-emerald-200 transition-colors duration-200 font-medium">Plants</Link>
                <Link to="/add" className="text-white hover:text-emerald-200 transition-colors duration-200 font-medium">Add Plant</Link>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-emerald-200 transition-colors duration-200 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-emerald-200 transition-colors duration-200 font-medium">Login</Link>
                <Link to="/signup" className="text-white hover:text-emerald-200 transition-colors duration-200 font-medium">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/feed" 
            element={
              <ProtectedRoute>
                <SocialFeed />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/plants" 
            element={
              <ProtectedRoute>
                <PlantsList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add" 
            element={
              <ProtectedRoute>
                <AddPlant />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit/:id" 
            element={
              <ProtectedRoute>
                <EditPlant />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

