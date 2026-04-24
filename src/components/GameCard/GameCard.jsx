import { Link } from 'react-router-dom';
import { useGameContext } from '../../hooks/useGameContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNotifications } from '../../context/NotificationProvider';
import StarRating from '../StarRating/StarRating';
import styles from './GameCard.module.css';

export default function GameCard({ game }) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useGameContext();
  const { isAuthenticated } = useAuthContext();
  const { showNotification } = useNotifications();

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    // Si es usuario, ir a detalle del juego
    window.location.href = `/game/${game.id}`;
    return;
    
    console.log('Click en favorito:', game.id, isFavorite(game.id));
    
    if (isFavorite(game.id)) {
      removeFromFavorites(game.id);
      showNotification(`${game.name} eliminado de favoritos`, 'info');
    } else {
      addToFavorites(game);
      showNotification(`${game.name} añadido a favoritos`, 'success');
    }
  };

  const favorite = isFavorite(game.id);
  const rating = game.rating ? game.rating.toFixed(1) : 'N/A';
  const year = game.released ? new Date(game.released).getFullYear() : 'TBA';
  const imageUrl = game.background_image || 'https://via.placeholder.com/300x400';

  // Obtener promedio de reseñas de usuarios
  const getUserRating = () => {
    try {
      const reviews = JSON.parse(localStorage.getItem(`gameReviews_${game.id}`) || '[]');
      if (reviews.length === 0) return null;
      
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      return (sum / reviews.length).toFixed(1);
    } catch (error) {
      return null;
    }
  };

  const userRating = getUserRating();

  return (
    <Link to={`/game/${game.id}`} className={styles.gameCard}>
      <div className={styles.image}>
        <img
          src={imageUrl}
          alt={game.name}
          loading="lazy"
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{game.name}</h3>
        <div className={styles.meta}>
          <div className={styles.ratings}>
            <div className={styles.ratingItem}>
              <span className={styles.ratingLabel}>Críticas:</span>
              <StarRating rating={parseFloat(rating) || 0} readonly={true} size="small" showValue={false} />
              <span className={styles.ratingValue}>{rating}</span>
            </div>
            {userRating && (
              <div className={styles.ratingItem}>
                <span className={styles.ratingLabel}>Usuarios:</span>
                <StarRating rating={parseFloat(userRating)} readonly={true} size="small" showValue={false} />
                <span className={`${styles.ratingValue} ${styles.user}`}>{userRating}</span>
              </div>
            )}
          </div>
          <span className={styles.released}>{year}</span>
        </div>
        <div className={styles.genres}>
          {game.genres && game.genres.slice(0, 3).map((genre) => (
            <span key={genre.id} className={styles.genre}>
              {genre.name}
            </span>
          ))}
        </div>
      </div>
      <button
        className={`${styles.favorite} ${favorite ? styles.active : ''}`}
        onClick={handleFavoriteClick}
      >
       {favorite ? '❤️' : '🤍'}
      </button>
    </Link>
  );
}