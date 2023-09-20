import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Executing react dom render');

ReactDOM.createRoot(document.getElementById('react-root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
