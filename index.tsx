import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("SoulCount: Booting...");

// Safety for GitHub Pages where 'process' might not be polyfilled in the browser global scope
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { env: {} };
}

const rootElement = document.getElementById('root');
const overlay = document.getElementById('loading-overlay');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
    
    // Hide overlay after a small delay to ensure React has painted
    setTimeout(() => {
      if (overlay) overlay.style.display = 'none';
      console.log("SoulCount: UI Active");
    }, 100);
    
  } catch (error: any) {
    console.error("SoulCount Render Error:", error);
    const errDisplay = document.getElementById('error-display');
    if (errDisplay) {
      errDisplay.style.display = 'block';
      errDisplay.innerText = "Render Error: " + (error?.message || "Unknown error");
    }
  }
} else {
  console.error("SoulCount: #root not found");
}