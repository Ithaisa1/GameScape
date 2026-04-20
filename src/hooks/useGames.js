import { useState, useEffect } from 'react';
import { getGames, searchGames, getGamesByGenre } from '../services/api';

export const useGames = (searchQuery = '', genre = '', page = 1) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError(null);

      try {
        let data;
        
        // Simple if-else logic
        if (searchQuery) {
          data = await searchGames(searchQuery, page);
        } else if (genre) {
          data = await getGamesByGenre(genre, page);
        } else {
          data = await getGames(page);
        }

        setGames(data.results);
        setTotalCount(data.count);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [searchQuery, genre, page]);

  return { games, loading, error, totalCount };
};