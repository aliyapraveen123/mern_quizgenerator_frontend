import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const features = [
  {
    icon: '✨',
    title: 'AI-Powered Quiz Generation',
    description: 'Generate questions from educational content using AI and turn learning material into active practice.'
  },
  {
    icon: '🎯',
    title: 'Multiple Question Counts',
    description: 'Choose 5, 10, 15, or 20 questions for quick revision or deeper practice sessions.'
  },
  {
    icon: '📚',
    title: 'Learn From Your Content',
    description: 'Use YouTube educational videos or paste study notes, transcripts, and article content.'
  },
  {
    icon: '📈',
    title: 'Track Your History',
    description: 'Review previous quizzes and monitor progress over time with your learning history.'
  }
];

const steps = [
  { title: 'Add Content', description: 'Paste a YouTube URL or your study material.' },
  { title: 'Generate', description: 'AI analyzes the content and builds a focused quiz.' },
  { title: 'Test Yourself', description: 'Answer questions and review your performance.' }
];

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handlePrimaryCTA = () => {
    if (user) {
      navigate('/generate');
      return;
    }
    navigate('/login');
  };

  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">AI LEARNING TOOLS</p>
            <h1>Turn Any Learning Content Into an Interactive Quiz</h1>
            <p className="hero-subtitle">
              Paste a YouTube educational video or your own study content. AI summarizes the material and creates a quiz to help you learn and test yourself.
            </p>

            <div className="hero-actions">
              <button className="btn btn-primary" onClick={handlePrimaryCTA}>Generate a Quiz</button>
              <a href="#how-it-works" className="btn btn-outline">How It Works</a>
            </div>
          </div>

          <div className="hero-preview">
            <div className="preview-card">
              <div className="preview-header">
                <span className="preview-label">QUESTION 1 OF 5</span>
                <span className="preview-badge">AI Generated</span>
              </div>

              <div className="preview-body">
                <h3>What is the primary goal of attention weights in Transformer-based learning models?</h3>

                <div className="quiz-options-preview">
                  <button className="preview-option">A. To restrict model processing exclusively to sequential inputs.</button>
                  <button className="preview-option selected">B. To dynamically highlight which parts of the input context matter most.</button>
                  <button className="preview-option">C. To reduce overall memory footprints during basic vector calculations.</button>
                  <button className="preview-option">D. To enforce hard-coded syntactic patterns.</button>
                </div>

                <div className="preview-footer">
                  <span>✓ Correct. Dynamic weighting is the foundation of Transformers.</span>
                  <button className="next-btn">Next Question →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-strip">
        <div className="container stats-grid">
          <div className="stat-box">
            <strong>1.2M+</strong>
            <span>Quizzes Generated</span>
          </div>
          <div className="stat-box">
            <strong>98.4%</strong>
            <span>Accuracy Rating</span>
          </div>
          <div className="stat-box">
            <strong>140,000+</strong>
            <span>Active Students & Educators</span>
          </div>
          <div className="stat-box">
            <strong>10x</strong>
            <span>Faster Study Prep</span>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="section-header center">
          <p className="eyebrow">FEATURES</p>
          <h2>Everything You Need to Learn Smarter</h2>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <div key={feature.title} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="container section how-it-works">
        <div className="section-header center">
          <p className="eyebrow">HOW IT WORKS</p>
          <h2>Master Content in Three Simple Steps</h2>
        </div>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={step.title} className="step-card">
              <div className="step-number">0{index + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container section callout-section">
        <div className="callout-card">
          <div className="callout-copy">
            <p className="eyebrow">INTERACTIVE DEMO</p>
            <h2>Witness active learning in action. Try it now.</h2>
            <p>
              Curious about what the output looks like? Use our pre-loaded concept card on the right to interact. Click on correct answers, try the diagnostics, and see how our AI highlights actionable learning gaps.
            </p>
            <div className="callout-actions">
              <button className="btn btn-primary" onClick={handlePrimaryCTA}>Generate Custom Quiz</button>
              <button className="btn btn-outline">Explore Pre-Loaded Library</button>
            </div>
          </div>

          <div className="callout-preview">
            <div className="mini-preview-card">
              <div className="mini-preview-header">
                <span>QUESTION 1 OF 5</span>
                <span>AI Generated</span>
              </div>
              <h3>What is the primary role of attention weights in Transformer-based learning models?</h3>
              <div className="mini-options">
                <div className="mini-option">To restrict model processing exclusively to sequential inputs.</div>
                <div className="mini-option active">To dynamically highlight which parts of the input context matter most.</div>
                <div className="mini-option">To reduce overall memory footprints during basic vector calculations.</div>
                <div className="mini-option">To enforce hard-coded syntactic patterns.</div>
              </div>
              <div className="mini-footer">
                <span>✓ Correct. Dynamic weighting is the foundation of Transformers.</span>
                <button>Next Question →</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container section cta-wrap">
        <div className="cta-banner">
          <p className="eyebrow">READY TO BEGIN</p>
          <h2>Ready to test your knowledge?</h2>
          <p>Join thousands of smart learners converting passive viewing hours into durable knowledge.</p>
          <button className="btn btn-primary light-btn" onClick={handlePrimaryCTA}>Create Your First Quiz</button>
        </div>
      </section>
    </div>
  );
}
