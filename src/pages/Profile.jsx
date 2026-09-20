import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { changePassword, updateProfile } from '../services/authService';
import API from '../services/api';

const menuItems = [
  'Account Details',
  'Security & Password',
  'Preferences',
  'Notifications'
];

export default function Profile() {
  const { user, updateUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [activeMenu, setActiveMenu] = useState('Account Details');
  const [loading, setLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
  }, [user]);

  const joinedDate = useMemo(() => {
    if (!user?.createdAt) return 'N/A';
    try {
      return new Date(user.createdAt).toLocaleString('en-US', {
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  }, [user?.createdAt]);

  const handleProfileSave = async () => {
    if (!name.trim() || !email.trim()) {
      setProfileMessage({ type: 'error', text: 'Name and email are required.' });
      return;
    }

    setLoading(true);
    setProfileMessage(null);

    try {
      const res = await updateProfile({ name, email });
      const nextUser = res.data || { name, email };
      updateUser(nextUser);
      setIsEditing(false);
      setProfileMessage({ type: 'success', text: res.message || 'Profile updated successfully.' });
    } catch (err) {
      setProfileMessage({ type: 'error', text: err?.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Please fill in all password fields.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    setLoading(true);
    setPasswordMessage(null);

    try {
      const res = await changePassword({ currentPassword, newPassword, confirmPassword });
      setPasswordMessage({ type: 'success', text: res.message || 'Password updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err?.message || 'Failed to update password.' });
    } finally {
      setLoading(false);
    }
  };

  const statsValue = '24 / 50';

  return (
    <div className="container profile-page-shell">
      <div className="profile-page-card">
        <aside className="profile-sidebar">
          <div className="profile-avatar">A</div>
          <div className="settings-menu-wrap">
            <div className="settings-label">Settings Menu</div>
            {menuItems.map((item) => (
              <button
                key={item}
                type="button"
                className={`settings-item ${activeMenu === item ? 'active' : ''}`}
                onClick={() => setActiveMenu(item)}
              >
                <span className="menu-icon">{item === 'Account Details' ? '◌' : item === 'Security & Password' ? '◔' : item === 'Preferences' ? '≡' : '◍'}</span>
                {item}
              </button>
            ))}
          </div>

          <div className="profile-summary-box">
            <div className="summary-label">Usage Summary</div>
            <div className="summary-row">
              <span>Quizzes Generated</span>
              <strong>{statsValue}</strong>
            </div>
            <div className="summary-progress">
              <span style={{ width: '48%' }} />
            </div>
          </div>
        </aside>

        <main className="profile-content">
          <h1>Account Settings</h1>
          <p className="profile-intro">Manage your profile credentials, change passwords, and configure account parameters.</p>

          <section className="profile-section">
            <div className="section-head">
              <h2>Account Details</h2>
              {!isEditing ? (
                <button type="button" className="btn btn-primary small-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
              ) : (
                <button type="button" className="btn btn-outline small-btn" onClick={() => { setIsEditing(false); setName(user?.name || ''); setEmail(user?.email || ''); }}>Cancel</button>
              )}
            </div>

            {profileMessage && <div className={`alert ${profileMessage.type === 'error' ? 'alert-error' : 'alert-success'}`}>{profileMessage.text}</div>}

            <div className="profile-details-grid">
              <div className="profile-field-group">
                <label className="form-label">Full Name</label>
                {isEditing ? (
                  <input className="form-input profile-input" value={name} onChange={(e) => setName(e.target.value)} />
                ) : (
                  <div className="profile-readonly">{user?.name || 'Not available'}</div>
                )}
              </div>

              <div className="profile-field-group">
                <label className="form-label">Email Address</label>
                {isEditing ? (
                  <input className="form-input profile-input" value={email} onChange={(e) => setEmail(e.target.value)} />
                ) : (
                  <div className="profile-readonly">{user?.email || 'Not available'}</div>
                )}
              </div>

              <div className="profile-field-group compact-field">
                <label className="form-label">Verification Status</label>
                <div className="verification-inline">
                  <span className="verification-dot" />
                  <span className="badge badge-pass">Verified</span>
                </div>
              </div>

              <div className="profile-field-group compact-field">
                <label className="form-label">Member Since</label>
                <div className="profile-readonly muted-readonly">{joinedDate}</div>
              </div>
            </div>

            {isEditing && (
              <div className="profile-action-row">
                <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleProfileSave} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
              </div>
            )}
          </section>

          <section className="profile-section password-section">
            <h2>Change Password</h2>

            {passwordMessage && <div className={`alert ${passwordMessage.type === 'error' ? 'alert-error' : 'alert-success'}`}>{passwordMessage.text}</div>}

            <div className="field-stack">
              <div className="form-group form-inline-group">
                <label className="form-label">Current Password</label>
                <input className="form-input" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="**********" />
              </div>

              <div className="password-row">
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input className="form-input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters" />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input className="form-input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-type new password" />
                </div>
              </div>

              <div className="profile-action-row align-right">
                <button type="button" className="btn btn-outline" onClick={() => { setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handlePasswordChange} disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
