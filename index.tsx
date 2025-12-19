import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("SoulCount: Initializing boot sequence...");

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
    console.log("SoulCount: Successfully mounted React application.");
  } catch (error: any) {
    console.error("SoulCount: Critical render error:", error);
    const errDisplay = document.getElementById('error-display');
    if (errDisplay) {
      errDisplay.style.display = 'block';
      errDisplay.innerText = "Fatal Error: " + (error?.message || "Unknown rendering error");
    }
  }
} else {
  console.error("SoulCount: Target container #root not found in DOM.");
}