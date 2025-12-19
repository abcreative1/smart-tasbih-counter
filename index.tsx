import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Safety for various deployment environments
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { env: {} };
}

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}