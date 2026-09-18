import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import { isValidEmail, isValidPassword } from '../utils/validation';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      // Client-side validation
      if (!form.name || form.name.trim().length < 2) {
        setError('Please enter your name (at least 2 characters)');
        setLoading(false);
        return;
      }
      if (!isValidEmail(form.email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }
      if (!isValidPassword(form.password)) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
      const res = await registerApi(form);
      if (res.success) {
        login({ _id: res.data._id, name: res.data.name, email: res.data.email }, res.data.token);
        navigate('/dashboard');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 480, margin: '40px auto' }}>
        <h2 style={{ marginBottom: 12 }}>Create an account</h2>
        <p style={{ color: '#64748b', marginBottom: 18 }}>Register to generate AI quizzes and save history.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input name="name" className="form-input" value={form.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input name="email" type="email" className="form-input" value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-input" value={form.password} onChange={handleChange} required minLength={6} />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Register'}
          </button>
        </form>

        <p style={{ marginTop: 14 }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
