import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("SoulCount: Starting bootstrap...");

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    // Rendering without StrictMode temporarily to ensure single pass initialization on mobile
    root.render(<App />);
    console.log("SoulCount: App rendered successfully");
  } catch (error: any) {
    console.error("SoulCount bootstrap error:", error);
    const errDisplay = document.getElementById('error-display');
    if (errDisplay) {
      errDisplay.style.display = 'block';
      errDisplay.innerText = "Initialization Error: " + error?.message;
    }
  }
} else {
  console.error("SoulCount: Root element not found");
}