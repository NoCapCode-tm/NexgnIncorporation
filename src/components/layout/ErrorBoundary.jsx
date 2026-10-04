import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Catch dynamic import failures (lazy loading chunks)
    if (
      error.message.includes('Failed to fetch dynamically imported module') || 
      error.message.includes('Importing a module script failed')
    ) {
      // Force a hard reload to grab the newest files from the server
      window.location.reload();
    }
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Inter, sans-serif' }}>
          <h2>A new version of Nexgn is available.</h2>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>We are updating your workspace...</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', backgroundColor: '#FF0915', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children; 
  }
}