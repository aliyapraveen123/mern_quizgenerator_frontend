import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi } from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import { isValidEmail } from '../utils/validation';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!isValidEmail(form.email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }
      if (!form.password || form.password.length < 6) {
        setError('Please enter your password (min 6 characters)');
        setLoading(false);
        return;
      }
      const res = await loginApi(form);
      if (res.success) {
        login({ _id: res.data._id, name: res.data.name, email: res.data.email }, res.data.token);
        navigate('/dashboard');
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 480, margin: '40px auto' }}>
        <h2 style={{ marginBottom: 12 }}>Welcome back</h2>
        <p style={{ color: '#64748b', marginBottom: 18 }}>Sign in to continue to AI Quiz Generator.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input name="email" type="email" className="form-input" value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-input" value={form.password} onChange={handleChange} required />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Log in'}
          </button>
        </form>

        <p style={{ marginTop: 14 }}>
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
