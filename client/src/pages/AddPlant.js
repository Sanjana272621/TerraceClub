import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddPlant() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    careNotes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/plants', formData);
      navigate('/plants');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add plant');
      setLoading(false);
    }
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Add New Plant</h2>
        </div>
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Plant Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Monstera, Snake Plant..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="species" className="block text-sm font-semibold text-gray-700 mb-2">
                Species
              </label>
              <input
                type="text"
                id="species"
                name="species"
                value={formData.species}
                onChange={handleChange}
                placeholder="e.g., Monstera deliciosa..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="careNotes" className="block text-sm font-semibold text-gray-700 mb-2">
                Care Notes
              </label>
              <textarea
                id="careNotes"
                name="careNotes"
                value={formData.careNotes}
                onChange={handleChange}
                placeholder="Water weekly, keep in indirect sunlight..."
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors resize-y"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                type="submit" 
                className="flex-1 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Plant'}
              </button>
              <button
                type="button"
                className="flex-1 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => navigate('/plants')}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPlant;

