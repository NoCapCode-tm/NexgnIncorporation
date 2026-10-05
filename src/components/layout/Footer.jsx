import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ padding: '40px 24px', backgroundColor: '#f8f9fa', borderTop: '1px solid #e4e4e4', textAlign: 'center' }}>
      <p style={{ color: '#666', fontSize: '0.9rem' }}>
        © {new Date().getFullYear()} Nexgn. All rights reserved.
      </p>
    </footer>
  );
}