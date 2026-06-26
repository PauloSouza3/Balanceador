import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

const globalStyles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  body { background: #0d1627; color: #e8f0ff; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 0; }
  button { font-family: inherit; }
  input { font-family: inherit; }
`

const style = document.createElement('style')
style.textContent = globalStyles
document.head.appendChild(style)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
