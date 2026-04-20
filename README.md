# GameScape 🎮

Buscador de videojuegos que permite a los usuarios encontrar títulos de forma rápida y personalizada según sus intereses, géneros o preferencias. La plataforma actúa como un punto de decisión informada: una vez localizado el videojuego deseado, el usuario puede visualizar su tráiler oficial (si lo hubiese) y acceder directamente al proceso de descarga o compra.

## 🌟 Características

- **Búsqueda de juegos**: Busca por nombre, género o plataforma
- **Fichas detalladas**: Información completa de cada juego (sinopsis, género, valoraciones, capturas)
- **Trailers**: Reproducción de tráilers oficiales dentro de la aplicación
- **Sistema de favoritos**: Guarda tus juegos favoritos para acceder rápidamente
- **Diseño responsive**: Optimizado para móviles (600px), tablets (1024px) y desktop
- **UI moderna**: Diseño oscuro con gradientes y animaciones suaves

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
│   │   ├── Navbar.jsx
│   │   ├── SearchBar.jsx
│   │   └── Loader.jsx
│   ├── context/          # Context API
│   │   └── GameContext.jsx
│   ├── hooks/            # Hooks personalizados
│   │   ├── useGames.js
│   │   └── UseGemaeDetail.js
│   ├── pages/            # Páginas de la aplicación
│   │   ├── Home.jsx
│   │   ├── GameDetail.jsx
│   │   └── Favorites.jsx
│   ├── services/         # Servicios API
│   │   └── api.js
│   ├── test/             # Tests unitarios
│   │   ├── setup.js
│   │   ├── GameCard.test.jsx
│   │   ├── useGames.test.jsx
│   │   └── useGameDetail.test.jsx
│   ├── utils/            # Utilidades
│   │   ├── filterGames.js
│   │   └── formatDate.js
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
npm test
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

1. **🔎 Buscar**: El usuario introduce el nombre de un videojuego o explora mediante filtros
2. **📄 Ver ficha**: Al seleccionar un juego, accede a información detallada
3. **🎬 Ver tráiler**: Reproduce el tráiler oficial del videojuego
4. **🤔 Decidir**: Evalúa si el videojuego le interesa
5. **⬇️ Descargar**: Redirección a la tienda oficial para descargar/comprar

## 🎨 Conceptos de React utilizados

- **Context API**: Gestión de estado global (favoritos, búsqueda, filtros)
- **useEffect**: Llamadas a la API y efectos secundarios
- **useMemo**: Optimización de renderizado
- **useState**: Gestión de estado local
- **React Router**: Navegación entre páginas
- **Props**: Paso de datos entre componentes
- **Hooks personalizados**: Lógica reutilizable

## 📱 Responsive Design

- **Móvil**: < 600px - Diseño de una columna
- **Tablet**: 601px - 1024px - Grid de 2-3 columnas
- **Desktop**: > 1024px - Grid de 4+ columnas

## 🔧 Scripts disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Previa del build
- `npm run lint` - Ejecuta ESLint
- `npm test` - Ejecuta tests

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

Desarrollado como proyecto de práctica para IronHack.
