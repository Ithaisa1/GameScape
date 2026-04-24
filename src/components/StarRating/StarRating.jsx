import React, { useState } from 'react';
import styles from './StarRating.module.css';

export default function StarRating({ 
  rating = 0, 
  onRatingChange, 
  readonly = false, 
  size = 'medium',
  showValue = false 
}) {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  const handleStarClick = (starValue) => {
    if (readonly) return;
    
    const newRating = starValue === currentRating ? 0 : starValue;
    setCurrentRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleMouseEnter = (starValue) => {
    if (readonly) return;
    setHoverRating(starValue);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  const renderStars = () => {
    const stars = [];
    const maxStars = 5;

    for (let i = 1; i <= maxStars; i++) {
      const isFilled = i <= (hoverRating || currentRating);
      const isHalfFilled = !isFilled && i - 0.5 <= (hoverRating || currentRating);
      
      stars.push(
        <button
          key={i}
          type="button"
          className={`${styles.starRatingStar} ${styles[size]} ${readonly ? styles.readonly : styles.interactive}`}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          disabled={readonly}
          aria-label={`Calificar ${i} de 5 estrellas`}
          aria-current={i === currentRating ? 'true' : 'false'}
        >
          <span className={`${styles.star} ${isFilled ? styles.filled : isHalfFilled ? styles.half : styles.empty}`}>
            {isFilled ? '⭐' : isHalfFilled ? '⭐' : '☆'}
          </span>
        </button>
      );
    }

    return stars;
  };

  return (
    <div className={`${styles.starRating} ${styles[size]}`}>
      <div className={styles.starRatingStars}>
        {renderStars()}
      </div>
      {showValue && (
        <span className={styles.starRatingValue}>
          {currentRating > 0 ? `${currentRating}/5` : 'Sin calificar'}
        </span>
      )}
    </div>
  );
}
