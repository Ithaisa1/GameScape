import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNotifications } from '../context/NotificationProvider';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import '../styles/ReviewList.css';

export default function ReviewList({ gameId, gameName }) {
  const { user, isAuthenticated } = useAuthContext();
  const { showNotification } = useNotifications();
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest, lowest, helpful
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    loadReviews();
  }, [gameId]);

  const loadReviews = () => {
    setLoading(true);
    try {
      const storedReviews = JSON.parse(localStorage.getItem(`gameReviews_${gameId}`) || '[]');
      setReviews(storedReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
      showNotification('Error al cargar las reseñas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = (newReview) => {
    setReviews(prev => {
      if (editingReview) {
        // Actualizar reseña existente
        return prev.map(review => 
          review.id === newReview.id ? newReview : review
        );
      } else {
        // Añadir nueva reseña
        return [newReview, ...prev];
      }
    });
    setEditingReview(null);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      return;
    }

    try {
      // Eliminar de las reseñas del juego
      const updatedReviews = reviews.filter(review => review.id !== reviewId);
      localStorage.setItem(`gameReviews_${gameId}`, JSON.stringify(updatedReviews));
      setReviews(updatedReviews);

      // Eliminar de las reseñas del usuario
      if (user) {
        const userReviews = JSON.parse(localStorage.getItem(`userReviews_${user.id}`) || '[]');
        const updatedUserReviews = userReviews.filter(review => review.id !== reviewId);
        localStorage.setItem(`userReviews_${user.id}`, JSON.stringify(updatedUserReviews));
      }

      showNotification('Reseña eliminada correctamente', 'success');
    } catch (error) {
      console.error('Error deleting review:', error);
      showNotification('Error al eliminar la reseña', 'error');
    }
  };

  const handleHelpfulVote = async (reviewId, isHelpful) => {
    if (!isAuthenticated) {
      showNotification('Debes iniciar sesión para votar', 'error');
      return;
    }

    try {
      const updatedReviews = reviews.map(review => {
        if (review.id === reviewId) {
          const voteKey = isHelpful ? 'helpful' : 'notHelpful';
          return {
            ...review,
            [voteKey]: (review[voteKey] || 0) + 1
          };
        }
        return review;
      });

      localStorage.setItem(`gameReviews_${gameId}`, JSON.stringify(updatedReviews));
      setReviews(updatedReviews);

      // Guardar voto del usuario para evitar votos duplicados
      const userVotes = JSON.parse(localStorage.getItem(`userVotes_${user.id}`) || '{}');
      userVotes[reviewId] = isHelpful ? 'helpful' : 'notHelpful';
      localStorage.setItem(`userVotes_${user.id}`, JSON.stringify(userVotes));

      showNotification('Voto registrado', 'success');
    } catch (error) {
      console.error('Error voting:', error);
      showNotification('Error al registrar tu voto', 'error');
    }
  };

  const getSortedReviews = () => {
    const sorted = [...reviews];
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating);
      case 'helpful':
        return sorted.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
      default:
        return sorted;
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });
    return distribution;
  };

  const sortedReviews = getSortedReviews();
  const averageRating = calculateAverageRating();
  const ratingDistribution = getRatingDistribution();

  if (loading) {
    return (
      <div className="review-list">
        <div className="review-list__loading">
          <div className="review-list__spinner"></div>
          <p>Cargando reseñas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-list">
      <div className="review-list__header">
        <h2 className="review-list__title">Reseñas de {gameName}</h2>
        
        {reviews.length > 0 && (
          <div className="review-list__stats">
            <div className="review-list__average">
              <span className="review-list__average-value">{averageRating}</span>
              <StarRating rating={parseFloat(averageRating)} readonly={true} size="large" />
              <span className="review-list__total-count">({reviews.length} reseñas)</span>
            </div>
            
            <div className="review-list__distribution">
              {Object.entries(ratingDistribution).reverse().map(([rating, count]) => (
                <div key={rating} className="review-list__distribution-item">
                  <span className="review-list__distribution-label">{rating} ⭐</span>
                  <div className="review-list__distribution-bar">
                    <div 
                      className="review-list__distribution-fill"
                      style={{ width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="review-list__distribution-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="review-list__controls">
        <div className="review-list__sort">
          <label htmlFor="sort-reviews" className="review-list__sort-label">Ordenar por:</label>
          <select
            id="sort-reviews"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="review-list__sort-select"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguas</option>
            <option value="highest">Mejor calificadas</option>
            <option value="lowest">Peor calificadas</option>
            <option value="helpful">Más útiles</option>
          </select>
        </div>
      </div>

      {/* Formulario de reseña */}
      <ReviewForm
        gameId={gameId}
        gameName={gameName}
        onReviewSubmitted={handleReviewSubmitted}
        existingReview={editingReview}
      />

      {/* Lista de reseñas */}
      {sortedReviews.length === 0 ? (
        <div className="review-list__empty">
          <div className="review-list__empty-icon">📝</div>
          <h3>Sin reseñas aún</h3>
          <p>Sé el primero en compartir tu opinión sobre {gameName}</p>
        </div>
      ) : (
        <div className="review-list__reviews">
          {sortedReviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-item__header">
                <div className="review-item__user">
                  <div className="review-item__user-info">
                    <h4 className="review-item__user-name">{review.userName}</h4>
                    <span className="review-item__user-nick">@{review.userNick}</span>
                  </div>
                  <div className="review-item__rating">
                    <StarRating rating={review.rating} readonly={true} size="small" />
                  </div>
                </div>
                <div className="review-item__meta">
                  <span className="review-item__date">
                    {new Date(review.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  {review.updatedAt !== review.createdAt && (
                    <span className="review-item__edited">(editada)</span>
                  )}
                </div>
              </div>
              
              <div className="review-item__content">
                <p className="review-item__text">{review.text}</p>
              </div>
              
              <div className="review-item__actions">
                <div className="review-item__helpful">
                  <span className="review-item__helpful-label">¿Útil?</span>
                  <button
                    className="review-item__helpful-btn"
                    onClick={() => handleHelpfulVote(review.id, true)}
                    disabled={!isAuthenticated}
                  >
                    👍 {review.helpful || 0}
                  </button>
                  <button
                    className="review-item__helpful-btn"
                    onClick={() => handleHelpfulVote(review.id, false)}
                    disabled={!isAuthenticated}
                  >
                    👎 {review.notHelpful || 0}
                  </button>
                </div>
                
                {isAuthenticated && user && review.userId === user.id && (
                  <div className="review-item__user-actions">
                    <button
                      className="review-item__edit-btn"
                      onClick={() => handleEditReview(review)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="review-item__delete-btn"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
