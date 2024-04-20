import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SearchContextProvider } from './context/searchContext';
import { AuthContextProvider } from './context/authContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SearchContextProvider>
        <AuthContextProvider>
          <Routes>
            <Route path='/*' element={<App />} />
          </Routes>
        </AuthContextProvider>
      </SearchContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);


