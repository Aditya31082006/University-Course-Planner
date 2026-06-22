import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { CourseProvider } from './Context/CourseContext';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* HashRouter is used on purpose: the app has no backend/server, so it
        may be deployed to any static host (Netlify, GitHub Pages, S3, a
        plain Apache/Nginx folder). HashRouter keeps all routing in the
        URL fragment (#/courses) so a hard refresh on a sub-route never
        produces a server-side 404 — no server rewrite rules required. */}
    <HashRouter>
      <CourseProvider>
        <App />
      </CourseProvider>
    </HashRouter>
  </React.StrictMode>
);
