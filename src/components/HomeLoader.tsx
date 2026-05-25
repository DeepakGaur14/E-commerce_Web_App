export default function HomeLoader({ message = 'Loading products...' }: { message?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '320px',
        padding: '48px 24px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      <div className="home-loader-spinner" aria-hidden="true">
        <span className="home-loader-ring" />
        <span className="home-loader-icon">🛍️</span>
      </div>

      <p
        style={{
          margin: '20px 0 8px 0',
          fontSize: '16px',
          fontWeight: 600,
          color: '#1a1a2e',
        }}
      >
        {message}
      </p>

      <div className="home-loader-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
