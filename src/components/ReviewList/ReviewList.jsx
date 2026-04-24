import { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNotifications } from '../../context/NotificationProvider';
import StarRating from '../StarRating/StarRating';
import ReviewForm from '../ReviewForm/ReviewForm';
import styles from './ReviewList.module.css';

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
      <div className={styles.reviewList}>
        <div className={styles.reviewListLoading}>
          <div className={styles.reviewListSpinner}></div>
          <p>Cargando reseñas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-list">
      <div className={styles.reviewListHeader}>
        <h2 className={styles.reviewListTitle}>Reseñas de {gameName}</h2>
        
        {reviews.length > 0 && (
          <div className={styles.reviewListStats}>
            <div className={styles.reviewListAverage}>
              <span className={styles.reviewListAverageValue}>{averageRating}</span>
              <StarRating rating={parseFloat(averageRating)} readonly={true} size="large" />
              <span className={styles.reviewListTotalCount}>({reviews.length} reseñas)</span>
            </div>
            
            <div className={styles.reviewListDistribution}>
              {Object.entries(ratingDistribution).reverse().map(([rating, count]) => (
                <div key={rating} className={styles.reviewListDistributionItem}>
                  <span className={styles.reviewListDistributionLabel}>{rating} ⭐</span>
                  <div className={styles.reviewListDistributionBar}>
                    <div 
                      className={styles.reviewListDistributionFill}
                      style={{ width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className={styles.reviewListDistributionCount}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.reviewListControls}>
        <div className={styles.reviewListSort}>
          <label htmlFor="sort-reviews" className={styles.reviewListSortLabel}>Ordenar por:</label>
          <select
            id="sort-reviews"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.reviewListSortSelect}
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
        <div className={styles.reviewListEmpty}>
          <div className={styles.reviewListEmptyIcon}>📝</div>
          <h3>Sin reseñas aún</h3>
          <p>Sé el primero en compartir tu opinión sobre {gameName}</p>
        </div>
      ) : (
        <div className={styles.reviewListReviews}>
          {sortedReviews.map((review) => (
            <div key={review.id} className={styles.reviewItem}>
              <div className={styles.reviewItemHeader}>
                <div className={styles.reviewItemUser}>
                  <div className={styles.reviewItemUserInfo}>
                    <h4 className={styles.reviewItemUserName}>{review.userName}</h4>
                    <span className={styles.reviewItemUserNick}>@{review.userNick}</span>
                  </div>
                  <div className={styles.reviewItemRating}>
                    <StarRating rating={review.rating} readonly={true} size="small" />
                  </div>
                </div>
                <div className={styles.reviewItemMeta}>
                  <span className={styles.reviewItemDate}>
                    {new Date(review.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  {review.updatedAt !== review.createdAt && (
                    <span className={styles.reviewItemEdited}>(editada)</span>
                  )}
                </div>
              </div>
              
              <div className={styles.reviewItemContent}>
                <p className={styles.reviewItemText}>{review.text}</p>
              </div>
              
              <div className={styles.reviewItemActions}>
                <div className={styles.reviewItemHelpful}>
                  <span className={styles.reviewItemHelpfulLabel}>¿Útil?</span>
                  <button
                    className={styles.reviewItemHelpfulBtn}
                    onClick={() => handleHelpfulVote(review.id, true)}
                    disabled={!isAuthenticated}
                  >
                    👍 {review.helpful || 0}
                  </button>
                  <button
                    className={styles.reviewItemHelpfulBtn}
                    onClick={() => handleHelpfulVote(review.id, false)}
                    disabled={!isAuthenticated}
                  >
                    👎 {review.notHelpful || 0}
                  </button>
                </div>
                
                {isAuthenticated && user && review.userId === user.id && (
                  <div className={styles.reviewItemUserActions}>
                    <button
                      className={styles.reviewItemEditBtn}
                      onClick={() => handleEditReview(review)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className={styles.reviewItemDeleteBtn}
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
