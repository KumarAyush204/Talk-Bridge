import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import StreamVideo from './stream';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <StreamVideo />
  // </React.StrictMode>
  
);

