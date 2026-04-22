# GameScape 

Buscador de videojuegos que permite a los usuarios encontrar títulos de forma rápida y personalizada según sus intereses, géneros o preferencias. La plataforma utiliza la API RAWG para mostrar información detallada de juegos con filtros avanzados y una interfaz moderna.

##  Características (Día 1)

- **Búsqueda de juegos**: Busca por nombre con autocompletado y debounce
- **Filtros avanzados**: Filtra por género (IDs numéricos compatibles con RAWG) y rating
- **Grid de juegos**: Visualización en grid responsive con información clave
- **Sistema de favoritos**: Añade/elimina juegos de favoritos
- **Paginación inteligente**: Estilo Netflix/Amazon con rango dinámico
- **Diseño responsive**: Optimizado para móviles, tablets y desktop
- **UI moderna**: Diseño oscuro con colores personalizados (#0F1115, #171A21, #222734, #5B8CFF, #A78BFA)

##  Características (Día 2) - GameDetail Mejorado

- **Página de detalle completa**: Información detallada de cada juego
- **Media automática**: Video (si está disponible) o imagen del juego
- **Layout profesional**: Grid con imagen/video a la izquierda, información a la derecha
- **Rating mejorado**: Icono de estrella y diseño visual atractivo
- **Corazones de favoritos**: Scalable sin círculo, con hover y animación
- **Plataformas agrupadas**: PS4/5=PlayStation, Xbox One/Series=Xbox, Nintendo unificado
- **Soporte multiplataforma**: Steam, Epic Games, GOG, Origin, Ubisoft Connect, Microsoft Store, Mobile, Web
- **Botones de tiendas inteligentes**: Solo aparecen si el juego está disponible en esa plataforma
- **Eliminación de duplicados**: Lógica con Map para garantizar unicidad total
- **Layout reorganizado**: Géneros bajo imagen, características donde está, plataformas y tiendas en ancho completo
- **Diseño responsive**: Adaptado para móviles y tablets
- **Sin contenido vacío**: Mensajes fallback cuando no hay información disponible

##  Características (Día 3) - Centralización de API & Mejoras UX

- **API centralizada en Context**: Todas las llamadas a API movidas a GameProvider
- **Refactorización de hooks**: Movidos useAuthContext y useGameContext a carpeta hooks/
- **Estado global unificado**: Loading, error, y datos gestionados centralmente
- **Mejora de rendimiento**: Reducción de llamadas duplicadas y mejor sincronización
- **Arquitectura limpia**: Separación clara entre lógica de API y componentes UI
- **Sugerencias inteligentes**: Sistema basado en historial de búsquedas del usuario
- **Corazón optimizado**: Movido a esquina inferior derecha, sin borde, tamaño reducido
- **Cierre automático**: Sugerencias se cierran al hacer clic fuera o presionar Escape
- **Historial de búsquedas**: Implementado por usuario en página de favoritos
- **GameDetail optimizado**: Componente ahora consume datos desde Context en lugar de estado local

##  Tiempos de Desarrollo

### Día 1 - Foundation & Core Features
- **Duración estimada**: 6-8 horas
- **Objetivos**: Estructura base, búsqueda, filtros, grid de juegos
- **Componentes creados**: Home, GameCard, SearchBar, GameFilters, Pagination, Navbar, Loader
- **Context API**: Implementación para favoritos, búsqueda, filtros, paginación
- **Testing**: Configuración de Vitest y tests básicos
- **Estilos**: Diseño responsive con tema oscuro

### Día 2 - GameDetail & Favorites Page
- **Duración estimada**: 5-6 horas
- **Objetivos**: Página de detalle completa y página de favoritos
- **Componentes creados**: GameDetail, Favorites
- **Features**: Media automática, plataformas agrupadas, botones de tiendas
- **UI/UX**: Mejora visual con ratings, corazones animados, layout profesional
- **Testing**: Tests para nuevos componentes y hooks

### Día 3 - API Centralization & Architecture
- **Duración estimada**: 6-7 horas
- **Objetivos**: Centralizar lógica de API en Context, refactorización
- **Cambios arquitectónicos**: Mover API calls de hooks a GameProvider
- **Optimización**: Mejora de rendimiento y sincronización de estado
- **Refactorización**: Actualización de Home y GameDetail para usar Context
- **Testing**: Actualización de tests para nueva arquitectura

### Total Acumulado (Día 1-3)
- **Horas totales**: 12-17 horas
- **Componentes**: 8 componentes principales + utilitarios
- **Tests**: Cobertura para hooks y componentes clave
- **Arquitectura**: Context API con gestión centralizada de estado y API
- **Features completas**: Búsqueda, filtros, favoritos, detalles, paginación responsive

## 🛠️ Tecnologías

- **React 19** - Framework frontend
- **Vite** - Build tool y dev server
- **React Router DOM** - Enrutamiento
- **Context API** - Gestión de estado global
- **Hooks personalizados** - `useAuthContext`, `useGameContext`
- **RAWG API** - Fuente de datos de videojuegos
- **Vitest** - Testing
- **React Testing Library** - Testing de componentes

## 📁 Estructura del proyecto

```
gamescape/
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── GameCard.jsx
│   │   ├── GameFilters.jsx
│   │   ├── Navbar.jsx
│   │   ├── Pagination.jsx
│   │   ├── SearchBar.jsx
│   │   ├── SearchSuggestions.jsx
│   │   ├── SearchHistory.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Loader.jsx
│   ├── context/          # Context API
│   │   ├── AuthContext.jsx
│   │   └── GameProvider.jsx
│   ├── hooks/            # Hooks personalizados (Día 3)
│   │   ├── useAuthContext.jsx
│   │   └── useGameContext.jsx
│   ├── pages/            # Páginas de la aplicación
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   ├── GameDetail.jsx (Día 2)
│   │   └── Favorites.jsx (Día 2)
│   ├── services/         # Servicios API
│   │   └── api.js
│   ├── styles/           # CSS modular
│   │   ├── App.css
│   │   ├── GameCard.css
│   │   ├── GameDetail.css (Día 2)
│   │   ├── GameFilters.css
│   │   ├── Favorites.css (Día 2)
│   │   ├── Home.css
│   │   ├── Loader.css
│   │   ├── Navbar.css
│   │   ├── Pagination.css
│   │   ├── SearchBar.css
│   │   ├── SearchSuggestions.css
│   │   ├── SearchHistory.css
│   │   ├── Profile.css
│   │   ├── Login.css
│   │   └── Register.css
│   ├── test/             # Tests unitarios
│   │   ├── setup.js
│   │   ├── GameCard.test.jsx
│   │   ├── useGames.test.jsx
│   │   └── useGameDetail.test.jsx
│   ├── router/           # Enrutamiento
│   │   └── index.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── .env                  # Variables de entorno
└── package.json
```

## 🚀 Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd gamescape
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura la API key de RAWG en el archivo `.env`:
```
VITE_RAWG_API_KEY=tu-api-key-aqui
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 🧪 Testing

Ejecuta los tests:
```bash
npm run test
```

Ejecuta los tests con UI:
```bash
npm run test:ui
```

## 📦 Build para producción

```bash
npm run build
```

## 🎯 Flujo de usuario

1. **🔎 Buscar**: El usuario introduce el nombre de un videojuego con autocompletado
2. **🎛️ Filtrar**: Aplica filtros por género y rating
3. **📄 Explorar**: Navega por el grid de juegos con paginación
4. **❤️ Favoritos**: Añade/elimina juegos de favoritos
5. **📄 Ver detalle** (Día 2): Accede a información completa del juego

## 🎨 Conceptos de React utilizados

- **Context API**: Gestión de estado global (favoritos, búsqueda, filtros, paginación, autenticación)
- **useEffect**: Llamadas a la API y efectos secundarios
- **useState**: Gestión de estado local
- **useRef**: Referencias DOM para detección de clics fuera
- **React Router**: Navegación entre páginas y rutas protegidas
- **Props**: Paso de datos entre componentes
- **Hooks personalizados**: Lógica reutilizable (useAuthContext, useGameContext)
- **Debounce**: Optimización de búsquedas con autocompletado
- **Event listeners**: Manejo de clics fuera y teclado (Escape)

## 📱 Responsive Design

- **Móvil**: < 600px - Diseño de una columna
- **Tablet**: 601px - 1024px - Grid de 2-3 columnas
- **Desktop**: > 1024px - Grid de 4+ columnas

## 🔧 Scripts disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Previa del build
- `npm run lint` - Ejecuta ESLint
- `npm run test` - Ejecuta tests
- `npm run test:ui` - Ejecuta tests con interfaz gráfica

## 📝 Uso de IA en el proyecto

Este proyecto ha sido desarrollado con asistencia de IA (Cascade) para:
- Generación de estructura de componentes
- Implementación de hooks personalizados
- Configuración de testing
- Optimización de código CSS responsive
- Documentación y README

## 📄 Licencia

Este proyecto es para fines educativos.

## 🐛 Problemas y Soluciones (Día 1-3)

### 🚨 Problemas Críticos

#### Día 1
- **Problema**: Error de contexto - useGameContext debe estar dentro de GameProvider
- **Solución**: Reestructuración del árbol de componentes para envolver App con GameProvider
- **Impacto**: Evitaba que la aplicación funcionara completamente

#### Día 2
- **Problema**: Parpadeo en GameDetail al cargar datos
- **Solución**: Implementación de estados de loading y manejo asíncrono optimizado
- **Impacto**: Mejora significativa de UX y percepción de rendimiento

### ⚠️ Problemas de Alta Prioridad

#### Día 1
- **Problema**: Sistema de autenticación incompleto
- **Solución**: Implementación completa de Login, Register, Profile y ProtectedRoute
- **Impacto**: Seguridad y experiencia de usuario completa

#### Día 2
- **Problema**: Botones de login/registro visibles para usuarios autenticados
- **Solución**: Lógica condicional en Navbar para mostrar perfil de usuario
- **Impacto**: UX coherente y profesional

#### Día 3
- **Problema**: Sugerencias de búsqueda fijas que tapaban contenido
- **Solución**: Implementación de detección de clics fuera y tecla Escape
- **Impacto**: UX mejorada y contenido siempre accesible

### 📋 Problemas de Media Prioridad

#### Día 2
- **Problema**: Corazón de favoritos en posición poco intuitiva
- **Solución**: Movimiento a esquina inferior derecha con diseño minimalista
- **Impacto**: Mejora de usabilidad y estética

#### Día 3
- **Problema**: Hooks desorganizados en carpeta context/
- **Solución**: Creación de carpeta hooks/ y refactorización completa
- **Impacto**: Mejora de mantenibilidad y organización del código

### 🔧 Problemas de Baja Prioridad

#### Día 1
- **Problema**: Warning de CSS background-clip
- **Solución**: Actualización de prefijos vendor y sintaxis compatible
- **Impacto**: Validación de código CSS

#### Día 3
- **Problema**: Emojis de corazón y estrella mal codificados
- **Solución**: Reemplazo con caracteres Unicode correctos
- **Impacto**: Visualización correcta de iconos

## 📊 Métricas de Desarrollo

### Componentes Implementados: 12
- **Core**: Home, GameCard, SearchBar, GameFilters, Pagination, Navbar
- **Autenticación**: Login, Register, Profile, ProtectedRoute
- **Búsqueda**: SearchSuggestions, SearchHistory
- **Detalles**: GameDetail, Favorites

### Hooks Personalizados: 2
- **useAuthContext**: Gestión de autenticación
- **useGameContext**: Gestión de juegos y favoritos

### Archivos CSS: 15
- Diseño responsive y tema oscuro consistente
- Animaciones y transiciones modernas
- Optimización para todos los dispositivos

## 👤 Autor

Desarrollado por Ithaisa SG.
