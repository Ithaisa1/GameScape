
---

# 📄 2. SPEC.md

```md
# ⚠️ NO MODIFICAR EL ARCHIVO

Este documento contiene las especificaciones técnicas del proyecto GameScape.

Está diseñado como referencia estructural del sistema y no debe ser modificado durante el desarrollo sin autorización del equipo docente.


```



# 📌 Resumen del proyecto

GameScape es una aplicación web de búsqueda y exploración de videojuegos que consume la API de RAWG.

Permite a los usuarios:
- Buscar videojuegos
- Filtrar por diferentes criterios
- Ver detalles completos de cada juego
- Guardar favoritos
- Registrar reseñas
- Gestionar su perfil de usuario

El objetivo es ofrecer una experiencia moderna, fluida y optimizada centrada en UX/UI.

---

# ⚙️ Requisitos técnicos

## Frontend
- React 19
- Vite como bundler
- React Router DOM para navegación
- Context API para estado global
- Hooks personalizados

## Estilos
- CSS Modules
- CSS global para variables de tema
- Diseño responsive mobile-first

## API
- RAWG API como fuente principal de datos
- Consumo mediante fetch/axios en servicios centralizados

## Testing
- Vitest
- React Testing Library
- Mock de APIs externas

---

# 🎯 Finalidad del proyecto

- Practicar arquitectura moderna en React
- Implementar consumo de API externa real
- Aplicar patrones de estado global
- Mejorar UX/UI en aplicaciones web
- Implementar sistema completo de autenticación
- Diseñar sistema de interacción de usuarios (favoritos y reseñas)

---

# 📁 Jerarquía de carpetas

```
src/
├── components/ # Componentes reutilizables
├── context/ # Context API (estado global)
├── hooks/ # Hooks personalizados
├── pages/ # Vistas principales
├── services/ # Lógica de API
├── styles/ # CSS global
├── test/ # Tests unitarios
├── router/ # Configuración de rutas
├── App.jsx
└── main.jsx

```





# 🎨 UI / UX planteado

## Principios de diseño
- Interfaz moderna tipo gaming
- Dark mode como base principal
- Acciones claras y accesibles
- Feedback visual constante

## Componentes clave de UX
- Navbar con acceso rápido
- Sistema de búsqueda con sugerencias
- Grid de juegos responsive
- Página de detalle inmersiva
- Sistema de notificaciones (toast)

## Experiencia de usuario
- Navegación fluida sin recargas
- Persistencia de datos (favoritos, sesión)
- Interacción inmediata con feedback visual
- Optimización para móvil y desktop

---

# 🔐 Arquitectura del estado

- AuthContext → autenticación
- GameContext → juegos, filtros, favoritos
- NotificationContext → sistema de mensajes
- ThemeContext → tema claro/oscuro

---

# 🚀 Consideraciones finales

El proyecto está diseñado para escalar fácilmente, permitiendo añadir:

- Sistema de recomendaciones
- PWA
- Multiidioma
- Sistema social de usuarios


