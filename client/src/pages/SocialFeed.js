import React, { useEffect, useState } from 'react';
import { getAuthHeader, removeToken, getCurrentUser } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

function SocialFeed() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    (async () => {
      const me = await getCurrentUser();
      if (!me) {
        removeToken();
        navigate('/login');
        return;
      }
      setUser(me);
      fetchPosts();
    })();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/posts', {
        headers: getAuthHeader()
      });

      if (response.status === 401) {
        removeToken();
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to load feed');
      }

      const data = await response.json();
      setPosts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      setCreating(true);
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ text })
      });

      if (response.status === 401) {
        removeToken();
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create post');
      }

      setText('');
      await fetchPosts();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      if (response.status === 401) {
        removeToken();
        navigate('/login');
        return;
      }
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete post');
      }
      setPosts(prev => prev.filter(p => p._id !== postId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Social Feed</h2>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Social Feed</h2>
          <p className="text-gray-600">See what everyone is posting</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleCreate} className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors resize-y mb-3"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={creating || !text.trim()}
              className="px-5 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>

        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <p className="text-gray-600">No posts yet. Be the first to post!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => {
              const isOwner = user && (post.userId?._id === user.id || post.userId === user.id);
              const authorName = post.userId?.name || 'Unknown';
              return (
                <div key={post._id} className="bg-white rounded-xl shadow p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm text-gray-600">{authorName}</p>
                      <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                    {isOwner && (
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap text-gray-800">{post.text}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SocialFeed;


