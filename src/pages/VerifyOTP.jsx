import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(location.state?.info || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    // simple client-side validation
    if (!/^[0-9]{6}$/.test(String(otp).trim())) {
      setMessage('Please enter the 6-digit code');
      setLoading(false);
      return;
    }
    try {
      const res = await API.post('/auth/verify-otp', { email, otp });
      if (res.data && res.data.success) {
        setMessage('Verification successful — please log in.');
        navigate('/login', { state: { info: 'verified', email } });
      } else {
        setMessage(res.data?.message || 'Verification failed');
      }
    } catch (err) {
      // API interceptor returns a normalized object { message, code }
      const serverMsg = err?.message || err?.response?.data?.message;
      setMessage(serverMsg || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const r = await API.post('/auth/resend-verification', { email });
      setMessage(r.data?.message || 'If an account exists, an OTP has been sent.');
    } catch (err) {
      const serverMsg = err?.message || err?.response?.data?.message;
      setMessage(serverMsg || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 480, margin: '40px auto' }}>
        <h2>Verify your email</h2>
        <p>Enter the 6-digit code we sent to your email.</p>
        {message && <div className="alert">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" required />
          </div>
          <div className="form-group">
            <label>OTP</label>
            <input value={otp} onChange={(e) => setOtp(e.target.value)} className="form-input" required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Verify'}</button>
        </form>
        <div style={{ marginTop: 12 }}>
          <button className="btn" onClick={handleResend} disabled={loading}>Resend code</button>
        </div>
        <p style={{ marginTop: 14 }}>
          Back to <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
