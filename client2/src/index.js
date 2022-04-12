import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import List from './list.jsx';
import Login from './login.jsx';
const container = document.getElementById('root');

// Create a root.
const root = ReactDOMClient.createRoot(container);
root.render(<Login />);
