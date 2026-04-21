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

## 🛠️ Tecnologías

- **React 19** - Framework frontend
- **Vite** - Build tool y dev server
- **React Router DOM** - Enrutamiento
- **Context API** - Gestión de estado global
- **Hooks personalizados** - `useGames`, `useGameDetail`
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
│   │   └── Loader.jsx
│   ├── context/          # Context API
│   │   ├── GameContext.js
│   │   ├── useGameContext.js
│   │   └── GameProvider.jsx
│   ├── hooks/            # Hooks personalizados
│   │   ├── useGames.js
│   │   └── useGameDetail.js
│   ├── pages/            # Páginas de la aplicación
│   │   ├── Home.jsx
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
│   │   └── SearchBar.css
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

- **Context API**: Gestión de estado global (favoritos, búsqueda, filtros, paginación)
- **useEffect**: Llamadas a la API y efectos secundarios
- **useState**: Gestión de estado local
- **React Router**: Navegación entre páginas
- **Props**: Paso de datos entre componentes
- **Hooks personalizados**: Lógica reutilizable (useGames, useGameDetail)
- **Debounce**: Optimización de búsquedas con autocompletado

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

## 👤 Autor

Desarrollado por Ithaisa SG.
