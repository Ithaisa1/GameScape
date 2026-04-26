/**
 * @file main.jsx
 * @description Punto de entrada de la aplicación React. Renderiza el componente App en el DOM
 *              dentro del elemento con id 'root'. Utiliza StrictMode para detectar problemas potenciales.
 * @module Entry
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Renderizar la aplicación en el elemento con id 'root' del HTML
// StrictMode activa verificaciones adicionales en desarrollo
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)