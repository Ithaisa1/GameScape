/**
 * @file vite.config.js
 * @description Configuración de Vite para el proyecto React. Configura el plugin de React
 *              y la configuración de tests con Vitest.
 * @module Configuration
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración de Vite
// https://vite.dev/config/
export default defineConfig({
  // Plugin de React para transformar JSX y optimizar el build
  plugins: [react()],
  // Configuración de Vitest para tests
  test: {
    // Habilitar globales de test (describe, it, expect, etc.) sin importar
    globals: true,
    // Usar jsdom como entorno para simular el DOM en tests
    environment: 'jsdom',
    // Archivo de setup para configurar el entorno de tests
    setupFiles: './src/test/setup.js',
  },
})
