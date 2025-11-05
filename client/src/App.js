import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import PlantsList from './pages/PlantsList';
import AddPlant from './pages/AddPlant';
import EditPlant from './pages/EditPlant';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-gradient-to-r from-emerald-700 to-teal-700 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-white">🌱 Terrace Club</h1>
              <div className="flex space-x-6">
                <a href="/" className="text-white hover:text-emerald-200 transition-colors duration-200 font-medium">Home</a>
                <a href="/plants" className="text-white hover:text-emerald-200 transition-colors duration-200 font-medium">Plants</a>
                <a href="/add" className="text-white hover:text-emerald-200 transition-colors duration-200 font-medium">Add Plant</a>
              </div>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/plants" element={<PlantsList />} />
          <Route path="/add" element={<AddPlant />} />
          <Route path="/edit/:id" element={<EditPlant />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

