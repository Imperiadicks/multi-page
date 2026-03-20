import './index.css';

import React from 'react';

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { SalonProvider } from './context/SalonContext';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SalonProvider>
        <App />
      </SalonProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();