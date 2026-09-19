import React, { useState } from 'react';
import { forgotPassword as forgotApi } from '../services/passwordService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await forgotApi({ email });
      setMessage(res.resetUrl ? 'Reset link (dev) sent' : res.message);
    } catch (err) {
      setMessage(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 480, margin: '40px auto' }}>
        <h2>Forgot Password</h2>
        <p>Enter your email to receive password reset instructions.</p>

        {message && <div className="alert">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input name="email" type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</button>
        </form>
      </div>
    </div>
  );
}
