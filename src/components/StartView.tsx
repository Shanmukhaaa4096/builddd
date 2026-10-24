interface StartViewProps {
  onStart: () => void;
}

export function StartView({ onStart }: StartViewProps) {
  return (
    <div className="app-card">
      <span className="badge">Diagnostic Assessment</span>
      <h1>ShikshaGap</h1>
      <p>
        Pinpoint foundational mathematics gaps in Class 5. Instead of just scoring
        right or wrong, this diagnostic test checks if fraction addition mistakes
        stem from equivalent fractions or multiplication fact gaps.
      </p>

      <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>How it works:</h3>
        <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#4A5568', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <li>Starts with adding unlike fractions (Level 3).</li>
          <li>If an error occurs, it steps back to test prerequisite concepts.</li>
          <li>Takes 2 to 6 questions and provides an audit trail explaining the root cause.</li>
        </ul>
      </div>

      <button className="btn" onClick={onStart} data-testid="start-btn">
        Start Diagnostic Quiz
      </button>
    </div>
  );
}
