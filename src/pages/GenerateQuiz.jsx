import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQuiz } from '../services/quizService';
import Loading from '../components/Loading';
import URLInput from '../components/URLInput';
import ErrorMessage from '../components/ErrorMessage';
import { validateYouTubeUrl, hasMinWords } from '../utils/validation';

export default function GenerateQuiz() {
  const [videoUrl, setVideoUrl] = useState('');
  const [content, setContent] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Client-side validation
      const hasContent = content && content.trim().length > 0;
      const hasUrl = videoUrl && videoUrl.trim().length > 0;

      if (!hasContent && !hasUrl) {
        setError('Please provide a YouTube URL or paste some content to generate a quiz.');
        setLoading(false);
        return;
      }

      if (hasContent && !hasMinWords(content, 20)) {
        setError('Please provide at least a few paragraphs of content (at least 20 words).');
        setLoading(false);
        return;
      }

      const payload = {};
      payload.numQuestions = Number(numQuestions) || 5;
      if (hasContent) payload.content = content.trim();
      else {
        const validation = validateYouTubeUrl(videoUrl.trim());
        if (!validation.isValid) {
          setError(validation.message || 'Please enter a valid YouTube video URL.');
          setLoading(false);
          return;
        }
        payload.videoUrl = videoUrl.trim();
      }

      const res = await generateQuiz(payload);
      if (res.success) {
        // Navigate to quiz viewer
        navigate(`/quiz/${res.data._id}`);
      } else {
        setError(res.message || 'Failed to generate quiz');
      }
    } catch (err) {
      const code = err.response?.data?.code;
      const message = err.response?.data?.message;
      if (code === 'TRANSCRIPT_UNAVAILABLE') {
        setError("Transcript unavailable. We couldn't access a transcript for this video. Please try another video.");
      } else if (code === 'INVALID_URL') {
        setError('Please enter a valid YouTube video URL.');
      } else if (code === 'EMPTY_TRANSCRIPT') {
        setError("We couldn't find enough content to generate a quiz from this video. Please try another video.");
      } else if (code === 'GEMINI_FAILURE' || code === 'API_KEY_MISSING') {
        setError("We couldn't generate the quiz right now. Please try again in a moment.");
      } else {
        setError(message || 'Something went wrong while processing your request. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container generate-page-shell">
      <div className="generate-card">
        <h2>Generate a Quiz</h2>
        <p className="generate-subtitle">Paste a YouTube educational video URL or paste your own content below.</p>

        <ErrorMessage>{error}</ErrorMessage>

        <form onSubmit={handleSubmit} className="generate-form">
          <div className="form-group">
            <label className="form-label">Number of Questions</label>
            <div className="question-options">
              {[5, 10, 15, 20].map((n) => (
                <label key={n} className={`question-option ${numQuestions === n ? 'selected' : ''}`}>
                  <input type="radio" name="numQuestions" value={n} checked={numQuestions === n} onChange={() => setNumQuestions(n)} disabled={loading} />
                  <span>{n}</span>
                </label>
              ))}
            </div>
          </div>

          <URLInput value={videoUrl} onChange={setVideoUrl} disabled={loading} />

          <div className="divider-with-text"><span>OR</span></div>

          <div className="form-group">
            <label className="form-label">Paste manual content (optional fallback)</label>
            <textarea
              className="form-input manual-content-input"
              rows={7}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste educational transcript or study notes here..."
              disabled={loading}
            />
          </div>

          <button className="btn btn-primary generate-submit" type="submit" disabled={loading}>
            {loading ? <Loading dark={true} /> : 'Generate Quiz'}
          </button>
        </form>
      </div>
    </div>
  );
}
