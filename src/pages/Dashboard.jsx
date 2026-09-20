import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getQuizHistory } from '../services/quizService';
import Loading from '../components/Loading';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getQuizHistory();
        if (res.success) {
          setHistory(Array.isArray(res.data) ? res.data : []);
        } else {
          setError(res.message || 'Failed to load your dashboard.');
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load your dashboard.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = useMemo(() => {
    const total = history.length;
    const completed = history.filter((item) => item.isAttempted || item.score !== undefined).length;
    const scores = history
      .filter((item) => typeof item.percentage === 'number')
      .map((item) => item.percentage);
    const averageScore = scores.length ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length) : 0;
    const bestScore = scores.length ? Math.max(...scores) : 0;

    return {
      total,
      completed,
      averageScore,
      bestScore
    };
  }, [history]);

  const recentQuizzes = history.slice(0, 3);

  if (loading) {
    return (
      <div className="container">
        <div className="card centered-card">
          <Loading dark />
          <p className="empty-subtitle" style={{ marginTop: 12 }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <div className="alert alert-error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Welcome back, {user?.name || 'Learner'}!</h1>
          <p className="muted">Ready to test your knowledge?</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/generate')}>
          Generate New Quiz
        </button>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Quizzes Created</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Quizzes Completed</span>
          <strong>{stats.completed}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Average Score</span>
          <strong>{stats.averageScore}%</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Best Score</span>
          <strong>{stats.bestScore}%</strong>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <button className="action-card" onClick={() => navigate('/generate')}>
              <span className="action-icon">⚡</span>
              <span>Generate Quiz</span>
            </button>
            <button className="action-card" onClick={() => navigate('/history')}>
              <span className="action-icon">🕘</span>
              <span>View History</span>
            </button>
          </div>
        </div>

        <div className="panel">
          <h3>Recent Quizzes</h3>
          {recentQuizzes.length === 0 ? (
            <div className="empty-state">
              <p>No quizzes yet. Create your first quiz to get started.</p>
              <button className="btn btn-primary" onClick={() => navigate('/generate')}>Generate Quiz</button>
            </div>
          ) : (
            <div className="recent-list">
              {recentQuizzes.map((quiz) => (
                <div key={quiz._id} className="recent-item">
                  <div>
                    <div className="recent-title">{quiz.title || 'Quiz'}</div>
                    <div className="recent-meta">
                      {quiz.totalQuestions || 0} questions · {new Date(quiz.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="recent-actions">
                    {typeof quiz.percentage === 'number' && (
                      <span className={quiz.passed ? 'badge badge-pass' : 'badge badge-fail'}>
                        {quiz.passed ? 'Passed' : 'Failed'}
                      </span>
                    )}
                    <Link to={`/quiz/${quiz._id}`} className="btn btn-outline small-btn">View</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
