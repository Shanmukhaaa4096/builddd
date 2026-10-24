import { QuizResult, AuditEntry } from '../types/engine';

interface ResultViewProps {
  result: QuizResult;
  auditTrail: AuditEntry[];
  onRestart: () => void;
}

export function ResultView({ result, auditTrail, onRestart }: ResultViewProps) {
  return (
    <div className="app-card">
      <span className="badge">Diagnostic Report</span>
      <h1>Assessment Complete</h1>

      {/* Main Verdict Box */}
      <div className="verdict-box" data-testid="verdict-card">
        <h2 className="verdict-title" data-testid="verdict-text">
          {result.verdict}
        </h2>
        <p style={{ color: '#1C2826', fontSize: '0.95rem' }}>{result.explanation}</p>
        <div style={{ marginTop: '0.5rem', background: '#FFFFFF', padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
          <strong style={{ fontSize: '0.85rem', color: '#1C2826' }}>Recommended Next Step:</strong>
          <p style={{ fontSize: '0.85rem', color: '#4A5568', marginTop: '0.2rem' }}>{result.recommendation}</p>
        </div>
      </div>

      {/* Audit Trail */}
      <div>
        <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>Diagnostic Audit Trail</h3>
        <p style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
          Here is how the assessment adapted to pinpoint your prerequisite foundations:
        </p>

        <div className="audit-section" data-testid="audit-trail">
          {auditTrail.map((entry, idx) => (
            <div key={`${entry.questionId}-${idx}`} className="audit-item" data-testid={`audit-item-${idx + 1}`}>
              <div className="audit-header">
                <span>
                  Q{idx + 1}: {entry.prompt} (Level {entry.level})
                </span>
                <span className={entry.wasCorrect ? 'audit-status-pass' : 'audit-status-miss'}>
                  {entry.wasCorrect ? '✓ Correct' : '✕ Missed'}
                </span>
              </div>
              <div>
                <span style={{ color: '#4A5568' }}>Your Answer: </span>
                <strong>{entry.selectedOptionText}</strong>
              </div>
              <div className="audit-reason">Reason: {entry.reason}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Restart CTA */}
      <button className="btn" onClick={onRestart} data-testid="restart-btn" style={{ marginTop: '0.5rem' }}>
        Try Again
      </button>
    </div>
  );
}
