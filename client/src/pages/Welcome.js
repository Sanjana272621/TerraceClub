import React from 'react';
import { Link } from 'react-router-dom';

function Welcome() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">Welcome to Terrace Club</h2>
          <p className="text-xl text-gray-600">Your personal plant management system</p>
        </div>
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <h3 className="text-3xl font-semibold text-gray-800 mb-6">Get Started</h3>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Manage your plant collection with ease. Add plants, track their care, and keep notes all in one place.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              to="/plants" 
              className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              View All Plants
            </Link>
            <Link 
              to="/add" 
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Add New Plant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;

