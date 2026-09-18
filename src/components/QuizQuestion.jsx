import React from 'react';

export default function QuizQuestion({ qIndex, question, userSel, showResult, onSelect }) {
  return (
    <div className="question-block">
      <div className="question-text">{qIndex + 1}. {question.question}</div>
      <div className="options-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {question.options.map((opt, i) => {
          const letter = String.fromCharCode(65 + i);
          let className = 'option-btn';
          if (!showResult && userSel === opt) className += ' selected';
          if (showResult) {
            if (opt === question.correctAnswer) className += ' correct-highlight';
            else if (userSel === opt && opt !== question.correctAnswer) className += ' wrong-highlight';
          }

          return (
            <button key={i} className={className} onClick={() => onSelect(qIndex, opt)} disabled={showResult}>
              <span className="option-letter">{letter}</span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
