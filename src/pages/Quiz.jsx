import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuizById, submitQuizResult } from '../services/quizService';
import Loading from '../components/Loading';
import QuizQuestion from '../components/QuizQuestion';


export default function Quiz() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getQuizById(id);
        if (res.success) setQuiz(res.data);
        else setError(res.message || 'Failed to load quiz');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="container"><div className="card" style={{ textAlign: 'center' }}><Loading dark /></div></div>;

  if (error) return <div className="container"><div className="card"><div className="alert alert-error">{error}</div></div></div>;

  if (!quiz) return null;
  const handleSelect = (qIndex, option) => {
    if (quiz.isAttempted || submitting || result) return;
    setSelected((s) => ({ ...s, [qIndex]: option }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const answers = quiz.questions.map((q, idx) => ({
        questionIndex: idx,
        selectedAnswer: selected[idx] || null
      }));

      const res = await submitQuizResult({ quizId: quiz._id, answers });
      if (res.success) {
        setResult(res.data);
        // Update local quiz object to reflect attempt
        setQuiz((prev) => ({ ...prev, isAttempted: true }));
      } else {
        setError(res.message || 'Failed to submit quiz');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 900, margin: '20px auto' }}>
        <h2>{quiz.title}</h2>
        <div className="summary-box">
          <div className="summary-title">AI Summary</div>
          <div className="summary-text">{quiz.summary}</div>
        </div>

        <h3>Questions ({quiz.questions.length})</h3>
        {quiz.questions.map((q, idx) => (
          <QuizQuestion
            key={idx}
            qIndex={idx}
            question={q}
            userSel={selected[idx]}
            showResult={result || quiz.isAttempted}
            onSelect={(qi, opt) => handleSelect(qi, opt)}
          />
        ))}

        {error && <div className="alert alert-error">{error}</div>}

        {!quiz.isAttempted && !result && (
          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loading dark /> : 'Submit Answers'}
            </button>
          </div>
        )}

        {(result || quiz.isAttempted) && (
          <div style={{ marginTop: 16 }}>
            <h3>Quiz Completed</h3>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <div className="card" style={{ padding: 12 }}>
                <strong>Score:</strong> {result ? result.score : quiz.score} / {quiz.questions.length}
              </div>
              <div className="card" style={{ padding: 12 }}>
                <strong>Percentage:</strong> {result ? result.percentage : quiz.percentage}%
              </div>
              <div className="card" style={{ padding: 12 }}>
                <strong>Status:</strong> <span className={ (result ? result.passed : quiz.passed) ? 'badge badge-pass' : 'badge badge-fail' }>{(result ? result.passed : quiz.passed) ? 'PASS' : 'FAIL'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
