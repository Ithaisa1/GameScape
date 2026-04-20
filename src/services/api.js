const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

export const getGames = async (page = 1, pageSize = 20) => {
  const response = await fetch(
    `${BASE_URL}/games?key=${API_KEY}&page=${page}&page_size=${pageSize}`
  );

  if (!response.ok) {
    throw new Error("Error al obtener los juegos");
  }

  return response.json();
};

export const getGameById = async (id) => {
  const response = await fetch(`${BASE_URL}/games/${id}?key=${API_KEY}`);

  if (!response.ok) {
    throw new Error("Error al obtener el detalle del juego");
  }

  return response.json();
};

export const searchGames = async (query, page = 1) => {
  const response = await fetch(
    `${BASE_URL}/games?key=${API_KEY}&search=${query}&page=${page}&page_size=20`
  );

  if (!response.ok) {
    throw new Error("Error al buscar juegos");
  }

  return response.json();
};

export const getGamesByGenre = async (genre, page = 1) => {
  const response = await fetch(
    `${BASE_URL}/games?key=${API_KEY}&genres=${genre}&page=${page}&page_size=20`
  );

  if (!response.ok) {
    throw new Error("Error al obtener juegos por género");
  }

  return response.json();
};

export const getGenres = async () => {
  const response = await fetch(`${BASE_URL}/genres?key=${API_KEY}`);

  if (!response.ok) {
    throw new Error("Error al obtener géneros");
  }

  return response.json();
};
