import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// The prerendered HTML is what non-JS crawlers read. createRoot replaces that
// snapshot on load. hydrateRoot fights the hero animation and the cookie banner.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
