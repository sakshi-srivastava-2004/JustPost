import React from 'react';
import ReactDOM from 'react-dom/client';  // Import from 'react-dom/client'
import App from './App';
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter

// Create a root element using createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app inside the root
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
