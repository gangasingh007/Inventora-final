import React, { useState } from 'react';
import { User, Mail, Lock, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/update-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email
        })
      });

      if (response.ok) {
        setMessage('Profile updated successfully');
      }
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      if (response.ok) {
        setMessage('Password changed successfully');
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      setMessage('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="page-header">
          <h1>Profile Settings</h1>
          <p>Manage your account information</p>
        </div>

        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="profile-content">
          <div className="profile-section">
            <h2>Personal Information</h2>
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-group">
                  <User size={20} className="input-icon" />
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-group">
                  <Mail size={20} className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Save size={20} />
                Update Profile
              </button>
            </form>
          </div>

          <div className="profile-section">
            <h2>Change Password</h2>
            <form onSubmit={handleChangePassword} className="profile-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <div className="input-group">
                  <Lock size={20} className="input-icon" />
                  <input
                    type="password"
                    id="currentPassword"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <div className="input-group">
                  <Lock size={20} className="input-icon" />
                  <input
                    type="password"
                    id="newPassword"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <div className="input-group">
                  <Lock size={20} className="input-icon" />
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Save size={20} />
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;