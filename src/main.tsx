import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Keep the prerendered poster and text. createRoot would wipe them and push LCP
// until the bundle finishes.
if (root.childElementCount > 0) {
  hydrateRoot(root, app, {
    onRecoverableError(error, info) {
      const message = error instanceof Error ? error.message : String(error)
      console.error("HYDRATE", message, info.componentStack?.slice(0, 400) ?? "")
    },
  })
} else createRoot(root).render(app)
