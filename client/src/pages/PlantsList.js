import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuthHeader, removeToken } from '../utils/auth';

function PlantsList() {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/plants', {
        headers: getAuthHeader()
      });

      if (response.status === 401) {
        removeToken();
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch plants');
      }

      const data = await response.json();
      setPlants(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this plant?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/plants/${id}`, {
          method: 'DELETE',
          headers: getAuthHeader()
        });

        if (response.status === 401) {
          removeToken();
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to delete plant');
        }

        fetchPlants();
      } catch (err) {
        alert(err.message);
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">All Plants</h2>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">All Plants</h2>
          </div>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">All Plants</h2>
          <p className="text-lg text-gray-600">{plants.length} {plants.length === 1 ? 'plant' : 'plants'} in your collection</p>
        </div>
        <div className="mb-6">
          <Link 
            to="/add" 
            className="inline-block px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Add New Plant
          </Link>
        </div>
        {plants.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">No plants yet</h3>
            <p className="text-gray-600 mb-8">Start by adding your first plant!</p>
            <Link 
              to="/add" 
              className="inline-block px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Add Your First Plant
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.map(plant => (
              <div key={plant._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">{plant.name}</h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {new Date(plant.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="space-y-3 mb-6">
                    {plant.species && (
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-1">Species</p>
                        <p className="text-gray-800">{plant.species}</p>
                      </div>
                    )}
                    {plant.careNotes && (
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-1">Care Notes</p>
                        <p className="text-gray-800 whitespace-pre-wrap">{plant.careNotes}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <Link 
                      to={`/edit/${plant._id}`} 
                      className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(plant._id)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlantsList;

