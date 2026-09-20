
import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login as loginApi, resendVerification } from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import { isValidEmail } from '../utils/validation';
import API from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: location.state?.email || '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState(null);

  const fromRegister = location.state?.info === 'registered';
  // devVerificationUrl removed: OTP flow will not expose verification links
  const devVerificationUrl = null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      if (!isValidEmail(form.email)) {
        setError('Please enter a valid email address');
        return;
      }

      if (!form.password || form.password.length < 6) {
        setError('Please enter your password (min 6 characters)');
        return;
      }

      const res = await loginApi(form);

      if (!res.success) {
        setError(res.message || 'Login failed');
        return;
      }

      // The server sets the HttpOnly authentication cookie.
      // Fetch the logged-in user to update AuthContext.
      const me = await API.get('/auth/me');

      if (me?.data) {
        login({
          _id: me.data._id,
          name: me.data.name,
          email: me.data.email
        });
      }

      navigate('/dashboard');
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Login failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendMsg(null);

    try {
      const email = location.state?.email || form.email || '';

      const r = await resendVerification({ email });

      setResendMsg(r.message || 'If an account exists, a verification email has been sent.');
    } catch (err) {
      setResendMsg('Failed to resend verification');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="container">
      <div
        className="card"
        style={{ maxWidth: 480, margin: '40px auto' }}
      >
        <h2 style={{ marginBottom: 12 }}>
          Welcome back
        </h2>

        <p
          style={{
            color: '#64748b',
            marginBottom: 18
          }}
        >
          Sign in to continue to AI Quiz Generator.
        </p>

        {fromRegister && (
          <div className="alert alert-info">
            Account created — please check your email to verify before logging in.

            <div style={{ marginTop: 8 }}>
              <button
                type="button"
                className="btn"
                disabled={resendLoading}
                onClick={handleResendVerification}
              >
                {resendLoading
                  ? 'Sending...'
                  : 'Resend verification email'}
              </button>
            </div>

            {resendMsg && (
              <div style={{ marginTop: 8 }}>
                {resendMsg}
              </div>
            )}

          </div>
        )}

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Email
            </label>

            <input
              name="email"
              type="email"
              className="form-input"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Password
            </label>

            <input
              name="password"
              type="password"
              className="form-input"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              'Log in'
            )}
          </button>
        </form>

        <p style={{ marginTop: 14 }}>
          New here?{' '}
          <Link to="/register">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

