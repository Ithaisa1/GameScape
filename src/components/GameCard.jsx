import { Link } from 'react-router-dom';
import { useGameContext } from '../hooks/useGameContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNotifications } from '../context/NotificationProvider';
import StarRating from './StarRating';
import '../styles/GameCard.css';

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
    <Link to={`/game/${game.id}`} className="game-card">
      <div className="game-card__image">
        <img
          src={imageUrl}
          alt={game.name}
          loading="lazy"
        />
      </div>
      <div className="game-card__content">
        <h3 className="game-card__title">{game.name}</h3>
        <div className="game-card__meta">
          <div className="game-card__ratings">
            <div className="game-card__rating-item">
              <span className="game-card__rating-label">Críticas:</span>
              <StarRating rating={parseFloat(rating) || 0} readonly={true} size="small" showValue={false} />
              <span className="game-card__rating-value">{rating}</span>
            </div>
            {userRating && (
              <div className="game-card__rating-item">
                <span className="game-card__rating-label">Usuarios:</span>
                <StarRating rating={parseFloat(userRating)} readonly={true} size="small" showValue={false} />
                <span className="game-card__rating-value user">{userRating}</span>
              </div>
            )}
          </div>
          <span className="game-card__released">{year}</span>
        </div>
        <div className="game-card__genres">
          {game.genres && game.genres.slice(0, 3).map((genre) => (
            <span key={genre.id} className="game-card__genre">
              {genre.name}
            </span>
          ))}
        </div>
      </div>
      <button
        className={`game-card__favorite ${favorite ? 'active' : ''}`}
        onClick={handleFavoriteClick}
      >
       {favorite ? '❤️' : '🤍'}
      </button>
    </Link>
  );
}