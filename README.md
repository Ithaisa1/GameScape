# 🎮 GameScape

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)

![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=for-the-badge&logo=vite)

![Status](https://img.shields.io/badge/Status-Finalizado-success?style=for-the-badge)

![License](https://img.shields.io/badge/License-Educational-blue?style=for-the-badge)

---

## 🚀 Demo en vivo

👉 https://game-scape-mu.vercel.app

---

## 📸 Preview del proyecto

### 🏠 Home
![Home](../GameScape/src/assets/Home-GameScape.png)

### 🎮 Detalle del juego
![Game Detail](../GameScape/src/assets/GameDetail-GameScape.png)

### ❤️ Favoritos
![Favorites](../GameScape/src/assets/Favorites-GameScape.png)

### 👤 Perfil
![Profile](../GameScape/src/assets/Profile-GameScape.png)

---

## 🧠 Descripción

**GameScape** es una plataforma web de búsqueda y exploración de videojuegos que consume la API de RAWG.

Permite a los usuarios descubrir juegos, ver información detallada, guardar favoritos, dejar reseñas y gestionar su perfil en una experiencia moderna tipo gaming.

---

## ✨ Features principales

### 🔎 Exploración de juegos
- Búsqueda en tiempo real con debounce
- Filtros por género, rating, plataforma y año
- Ordenación dinámica
- Paginación tipo Netflix

### 🎮 Detalle de juego
- Información completa del videojuego
- Imagen automática
- Plataformas y géneros agrupados
- Tiendas oficiales con enlaces directos

### ❤️ Favoritos
- Sistema completo de favoritos
- Persistencia en localStorage
- Página dedicada

### 👤 Usuarios
- Registro y login completo
- Perfil editable
- Eliminación de cuenta
- Autenticación persistente

### 📝 Reseñas
- Sistema de reviews por usuario
- Valoración con estrellas (1–5)
- Media global automática

### 🔔 UX moderna
- Toast notifications
- Tema claro / oscuro
- Microinteracciones
- Diseño responsive completo

---

## 🛠️ Tech Stack

- React 19 ⚛️
- Vite ⚡
- React Router DOM 🧭
- Context API 🧠
- CSS Modules 🎨
- RAWG API 🎮
- Vitest 🧪
- Testing Library 🧪
- Asistencia con IA (ChatGPT / herramientas de IA para desarrollo y documentación)
---

## 🏗️ Arquitectura

```
src/
├── components/ # UI reutilizable
├── pages/ # Vistas principales
├── context/ # Estado global
├── hooks/ # Lógica reutilizable
├── services/ # API
├── styles/ # CSS
├── router/ # Rutas
└── test/ # Testing
```



## ⚙️ Instalación

```bash
git clone https://github.com/tuusuario/gamescape.git
cd gamescape
npm install
npm run dev
```

## 🔑 Variables de entorno
```
VITE_RAWG_API_KEY=tu_api_key
```

## 🧪 Testing
```
npm run test
```


---

📱 - Responsive design

📱 - Mobile first

📟 - Tablet adaptado

🖥  - Desktop optimizado



## 🎯 Objetivo del proyecto

Este proyecto fue creado para:

- Practicar arquitectura moderna en React
- Consumir APIs reales
- Implementar autenticación completa
- Mejorar UX/UI en aplicaciones reales
- Aplicar Context API y hooks personalizados
- Trabajar testing con Vitest


 # 📊 Tiempos de Desarrollo - GameScape 

Este documento recoge el tiempo invertido en el desarrollo del proyecto GameScape.

---

## 🗓️ Día 1 - Foundation & Core Features
**Fecha:** 23/04/2026  
**Duración:** 12 horas  

### ⏱️ Trabajo realizado:
- Configuración inicial del proyecto (Vite + React + Router)
- Integración con API RAWG
- Context API (GameProvider, AuthContext)
- Sistema de búsqueda con debounce
- Filtros por género y rating
- Grid de juegos responsive
- Sistema de favoritos
- Paginación tipo Netflix/Amazon
- Estructura base de componentes

---

## 🗓️ Día 2 - GameDetail & Favorites
**Fecha:** 24/04/2026  
**Duración:** 8 horas  

### ⏱️ Trabajo realizado:
- Página GameDetail completa
- Media dinámica (video o imagen)
- Layout profesional en dos columnas
- Sistema de rating visual
- Favoritos con animaciones
- Agrupación de plataformas
- Integración de tiendas
- Diseño responsive completo

---

## 🗓️ Día 3 - Sistema de usuarios & UX
**Fecha:** 25/04/2026  
**Duración:** 9 horas  

### ⏱️ Trabajo realizado:
- Registro y login completo
- Perfil de usuario editable
- Eliminación de cuenta
- Autenticación persistente (localStorage)
- Sistema de notificaciones (toast)
- Tema claro/oscuro
- Persistencia del tema
- Redirecciones inteligentes
- Mejora de UX general

---

## 🗓️ Día 4 - Reviews & configuración avanzada
**Fecha:** 26/04/2026  
**Duración:** 11h 50min  

### ⏱️ Trabajo realizado:
- Sistema completo de reseñas
- Valoraciones con estrellas (1-5)
- Promedio automático de ratings
- Página de configuración avanzada
- Preferencias de usuario
- Sistema de privacidad
- Filtros avanzados (ordenación + multi filtro)
- Corrección de bugs en Settings.jsx
- Optimización de UX en filtros

---

## 🗓️ Día 5 - Limpieza & optimización del proyecto
**Fecha:** 27/04/2026  
**Duración:** 8h 20min  

### ⏱️ Trabajo realizado:
- Auditoría completa del proyecto
- Eliminación de 18 archivos obsoletos
- Limpieza de CSS duplicado
- Reestructuración de estilos
- Recreación de CSS necesarios
- Optimización de arquitectura
- Mejora de consistencia en CSS Modules
- Reducción de peso del proyecto (~68 KB menos)

---

## 📌 Resumen total (Día 1 → Día 5)

- 🧠 **Tiempo total:** 48h 20min aprox
- 📅 **Días trabajados:** 5 días
- ⚙️ **Funcionalidades implementadas:** 40+
- 🧩 **Componentes creados:** 15+
- 🎯 **Estado del proyecto:** Funcional y optimizado

---

## 🚀 Conclusión

El proyecto ha evolucionado desde una base funcional hasta un sistema completo con:

- Autenticación
- Sistema de usuarios
- Reviews
- Tema claro/oscuro
- Filtros avanzados
- UX optimizada
- Código limpio y escalable

## 👩‍💻 Autor

Desarrollado por Ithaisa SG ✨

Proyecto educativo - 2026