import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getQuizHistory } from '../services/quizService';
import Loading from '../components/Loading';

export default function History() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getQuizHistory();
        if (res.success) setQuizzes(res.data || []);
        else setError(res.message || 'Failed to load history');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = useMemo(() => {
    const total = quizzes.length;
    const percentages = quizzes
      .map((q) => Number(q.percentage ?? 0))
      .filter((value) => Number.isFinite(value));
    const average = percentages.length ? Math.round(percentages.reduce((sum, value) => sum + value, 0) / percentages.length) : 0;
    const passedCount = quizzes.filter((q) => q.passed).length;
    const overallRate = total ? Math.round((passedCount / total) * 100) : 0;

    return { total, average, overallRate };
  }, [quizzes]);

  if (loading) {
    return (
      <div className="container history-shell">
        <div className="card centered-card">
          <Loading dark />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container history-shell">
        <div className="card">
          <div className="alert alert-error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container history-shell">
      <div className="history-header">
        <h1>Your Quiz History</h1>
        <p>Track your performance, review correct answers, and retake quizzes to improve.</p>
      </div>

      <div className="history-stats">
        <div className="history-stat-card">
          <div className="history-stat-top">
            <span>Total Quizzes Taken</span>
            <span className="history-icon">▣</span>
          </div>
          <div className="history-stat-value">{stats.total}</div>
          <div className="history-stat-foot">All-time stats</div>
        </div>

        <div className="history-stat-card">
          <div className="history-stat-top">
            <span>Average Performance</span>
            <span className="history-icon green-icon">↗</span>
          </div>
          <div className="history-stat-value">{stats.average}%</div>
          <div className="history-stat-foot">Based on completed scores</div>
        </div>

        <div className="history-stat-card">
          <div className="history-stat-top">
            <span>Overall Pass Rate</span>
            <span className="history-icon blue-icon">◌</span>
          </div>
          <div className="history-stat-value">{stats.overallRate}%</div>
          <div className="history-stat-foot">{passedCountText(quizzes)} passed</div>
        </div>
      </div>

      <div className="history-table-card">
        <div className="history-table-header">
          <span>Quiz Info</span>
          <span>Date Completed</span>
          <span>Score</span>
          <span>Percentage</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {quizzes.length === 0 ? (
          <div className="empty-state history-empty">
            <div className="empty-icon">▣</div>
            <p>You have no saved quizzes yet. Generate one to get started.</p>
            <Link to="/generate" className="btn btn-primary">Generate Quiz</Link>
          </div>
        ) : (
          <div className="history-table-body">
            {quizzes.map((q) => (
              <div key={q._id} className="history-row">
                <div className="history-quiz-info">
                  <div className="history-quiz-title">{q.title || 'Untitled Quiz'}</div>
                  <div className="history-quiz-subtitle">{q.topic || 'AI Generated Topic'}</div>
                </div>

                <div className="history-cell mobile-hidden">{formatDate(q.createdAt)}</div>
                <div className="history-cell mobile-hidden">{q.score ?? 0}/{q.totalQuestions ?? 0}</div>
                <div className="history-cell mobile-hidden">{q.percentage ?? 0}%</div>
                <div className="history-cell mobile-hidden">
                  <span className={q.passed ? 'badge badge-pass' : 'badge badge-fail'}>{q.passed ? 'PASS' : 'FAIL'}</span>
                </div>
                <div className="history-cell history-actions">
                  <Link to={`/quiz/${q._id}`} className="history-view-btn">View</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(dateValue) {
  if (!dateValue) return 'N/A';

  try {
    return new Date(dateValue).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    return 'N/A';
  }
}

function passedCountText(quizzes) {
  const passed = quizzes.filter((q) => q.passed).length;
  return `${passed} of ${quizzes.length} quizzes passed`;
}

