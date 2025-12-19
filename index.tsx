import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("SoulCount: Initializing application...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("SoulCount: Could not find root element to mount to");
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("SoulCount: React render complete");
} catch (error) {
  console.error("SoulCount: Error during initialization:", error);
}