import { useState, useEffect } from 'react';
import { getGameById } from '../services/api';

export const useGameDetail = (id) => {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameDetail = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getGameById(id);
        setGame(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetail();
  }, [id]);

  return { game, loading, error };
};