import React, { useState, useEffect } from 'react';
import { User, Mail, Save, LogOut } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Profile({ setIsAuthenticated }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://3.145.32.82/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://3.145.32.82/api/user/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ac8e8e]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
              <button
                onClick={handleLogout}
                className="flex items-center text-red-500 hover:text-red-600"
              >
                <LogOut size={20} className="mr-2" />
                Logout
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!editing}
                    className="focus:ring-[#ac8e8e] focus:border-[#ac8e8e] block w-full pl-10 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!editing}
                    className="focus:ring-[#ac8e8e] focus:border-[#ac8e8e] block w-full pl-10 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                {editing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          name: user.name,
                          email: user.email
                        });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center px-4 py-2 bg-[#ac8e8e] text-white rounded-md hover:bg-[#9a7c7c]"
                    >
                      <Save size={20} className="mr-2" />
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-[#ac8e8e] text-white rounded-md hover:bg-[#9a7c7c]"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}