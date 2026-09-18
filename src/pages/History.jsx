import React, { useEffect, useState } from 'react';
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
        if (res.success) setQuizzes(res.data);
        else setError(res.message || 'Failed to load history');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="container"><div className="card" style={{ textAlign: 'center' }}><Loading dark /></div></div>;
  if (error) return <div className="container"><div className="card"><div className="alert alert-error">{error}</div></div></div>;

  return (
    <div className="container">
      <div className="card" style={{ marginTop: 20 }}>
        <h2>Your Quiz History</h2>
        {quizzes.length === 0 ? (
          <div className="alert alert-info">You have no saved quizzes yet. Generate one to get started.</div>
        ) : (
          <div style={{ marginTop: 12 }}>
            {quizzes.map((q) => (
              <div key={q._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{q.title}</div>
                  <div style={{ color: '#64748b', fontSize: 13 }}>{new Date(q.createdAt).toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div>Score: {q.score} / {q.totalQuestions}</div>
                    <div>Percentage: {q.percentage}%</div>
                    <div>Status: <span className={q.passed ? 'badge badge-pass' : 'badge badge-fail'}>{q.passed ? 'PASS' : 'FAIL'}</span></div>
                  </div>
                  <Link to={`/quiz/${q._id}`} className="btn btn-outline">View</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
