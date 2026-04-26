const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

// Debug: Verificar si la API key está disponible
console.log('API Key disponible:', !!API_KEY);
console.log('API Key length:', API_KEY?.length || 0);

/**
 * @function getGames
 * @description Obtiene una lista paginada de juegos de la API RAWG
 * @param {number} [page=1] - Número de página a obtener
 * @param {number} [pageSize=20] - Cantidad de juegos por página
 * @returns {Promise<Object>} Objeto con resultados y count de juegos
 * @throws {Error} Si la respuesta de la API no es exitosa
 */
export const getGames = async (page = 1, pageSize = 20) => {
  const response = await fetch(
    `${BASE_URL}/games?key=${API_KEY}&page=${page}&page_size=${pageSize}`
  );

  if (!response.ok) {
    throw new Error("Error al obtener los juegos");
  }

  return response.json();
};

/**
 * @function getGameById
 * @description Obtiene detalles completos de un juego específico por su ID
 * @param {string|number} id - ID del juego a obtener
 * @returns {Promise<Object>} Objeto con detalles del juego
 * @throws {Error} Si la respuesta de la API no es exitosa
 */
export const getGameById = async (id) => {
  const response = await fetch(`${BASE_URL}/games/${id}?key=${API_KEY}`);

  if (!response.ok) {
    throw new Error("Error al obtener el detalle del juego");
  }

  return response.json();
};

/**
 * @function searchGames
 * @description Busca juegos por texto de consulta
 * @param {string} query - Texto de búsqueda
 * @param {number} [page=1] - Número de página de resultados
 * @returns {Promise<Object>} Objeto con resultados de búsqueda
 * @throws {Error} Si la respuesta de la API no es exitosa
 */
export const searchGames = async (query, page = 1) => {
  const response = await fetch(
    `${BASE_URL}/games?key=${API_KEY}&search=${query}&page=${page}&page_size=20`
  );

  if (!response.ok) {
    throw new Error("Error al buscar juegos");
  }

  return response.json();
};

/**
 * @function searchSuggestions
 * @description Obtiene sugerencias de búsqueda (limitado a 5 resultados)
 * @param {string} query - Texto de búsqueda para sugerencias
 * @returns {Promise<Object>} Objeto con resultados de sugerencias
 * @throws {Error} Si la respuesta de la API no es exitosa
 */
export const searchSuggestions = async (query) => {
  const response = await fetch(
    `${BASE_URL}/games?key=${API_KEY}&search=${query}&page_size=5`
  );

  if (!response.ok) {
    throw new Error("Error al obtener sugerencias");
  }

  return response.json();
};

/**
 * @function getGamesByGenre
 * @description Obtiene juegos filtrados por un género específico
 * @param {string|number} genre - ID del género a filtrar
 * @param {number} [page=1] - Número de página de resultados
 * @returns {Promise<Object>} Objeto con resultados filtrados por género
 * @throws {Error} Si la respuesta de la API no es exitosa
 */
export const getGamesByGenre = async (genre, page = 1) => {
  const response = await fetch(
    `${BASE_URL}/games?key=${API_KEY}&genres=${genre}&page=${page}&page_size=20`
  );

  if (!response.ok) {
    throw new Error("Error al obtener juegos por género");
  }

  return response.json();
};


/**
 * @function searchGamesWithGenre
 * @description Busca juegos combinando texto de consulta y filtro de género
 * @param {string} query - Texto de búsqueda
 * @param {string|number} genre - ID del género a filtrar
 * @param {number} [page=1] - Número de página de resultados
 * @returns {Promise<Object>} Objeto con resultados de búsqueda filtrados
 * @throws {Error} Si la respuesta de la API no es exitosa
 */
export const searchGamesWithGenre = async (query, genre, page = 1) =>{
  const response = await fetch(`${BASE_URL}/games?key=${API_KEY}&search=${query}&genres=${genre}&page=${page}&page_size=20`);
  
  if (!response.ok) {
    throw new Error("Error al buscar juegos con género");
  }

  return response.json();
}

/**
 * @function getGenres
 * @description Obtiene la lista completa de géneros disponibles en la API
 * @returns {Promise<Object>} Objeto con lista de géneros
 * @throws {Error} Si la respuesta de la API no es exitosa
 */
export const getGenres = async () => {
  const response = await fetch(`${BASE_URL}/genres?key=${API_KEY}`);

  if (!response.ok) {
    throw new Error("Error al obtener géneros");
  }

  return response.json();
};

/**
 * @function getGameStores
 * @description Obtiene las tiendas donde está disponible un juego específico
 * @param {string|number} gameId - ID del juego
 * @returns {Promise<Object>} Objeto con resultados de tiendas o {results: []} en caso de error
 */
export const getGameStores = async (gameId) => {
  try {
    const response = await fetch(`${BASE_URL}/games/${gameId}/stores?key=${API_KEY}`);
    
    if (!response.ok) {
      throw new Error("Error al obtener tiendas del juego");
    }

    const data = await response.json();
    console.log('Stores API response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching stores:', error);
    return { results: [] };
  }
};
