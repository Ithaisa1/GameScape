/**
 * @file StarRating.jsx
 * @description Componente de valoración con estrellas que permite a los usuarios calificar juegos.
 *              Soporta modo interactivo y solo lectura, diferentes tamaños y visualización del valor numérico.
 * @module Components
 */

import React, { useState } from 'react';
import styles from './StarRating.module.css';

/**
 * @component StarRating
 * @description Componente de valoración con estrellas interactivas. Permite calificar de 1 a 5 estrellas
 *              con soporte para modo solo lectura, diferentes tamaños y visualización del valor numérico.
 *
 * @param {Object} props
 * @param {number} [props.rating=0] - Valor inicial de la calificación (0-5)
 * @param {Function} [props.onRatingChange] - Callback que se ejecuta cuando cambia la calificación
 * @param {boolean} [props.readonly=false] - Si es true, las estrellas no son interactivas
 * @param {string} [props.size='medium'] - Tamaño de las estrellas ('small', 'medium', 'large')
 * @param {boolean} [props.showValue=false] - Si es true, muestra el valor numérico junto a las estrellas
 *
 * @returns {JSX.Element} Componente de estrellas con valoración
 *
 * Estado interno:
 * - hoverRating: Valor de la estrella sobre la que está el cursor (para feedback visual)
 * - currentRating: Valor actual de la calificación seleccionada
 */
export default function StarRating({ 
  rating = 0, 
  onRatingChange, 
  readonly = false, 
  size = 'medium',
  showValue = false 
}) {
  // Estado para el feedback visual al pasar el mouse sobre las estrellas
  const [hoverRating, setHoverRating] = useState(0);
  // Estado para la calificación actual seleccionada
  const [currentRating, setCurrentRating] = useState(rating);

  /**
   * @function handleStarClick
   * @description Maneja el clic en una estrella. Si la estrella ya está seleccionada, la deselecciona.
   *              Solo funciona si el componente no está en modo readonly.
   * @param {number} starValue - Valor de la estrella clickeada (1-5)
   */
  const handleStarClick = (starValue) => {
    if (readonly) return;
    
    const newRating = starValue === currentRating ? 0 : starValue;
    setCurrentRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  /**
   * @function handleMouseEnter
   * @description Actualiza el estado hoverRating cuando el mouse entra en una estrella
   * @param {number} starValue - Valor de la estrella sobre la que está el cursor
   */
  const handleMouseEnter = (starValue) => {
    if (readonly) return;
    setHoverRating(starValue);
  };

  /**
   * @function handleMouseLeave
   * @description Resetea el estado hoverRating cuando el mouse sale de las estrellas
   */
  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  /**
   * @function renderStars
   * @description Genera el array de 5 estrellas con sus estados correspondientes (llena, media, vacía)
   * @returns {Array<JSX.Element>} Array de botones de estrellas
   */
  const renderStars = () => {
    const stars = [];
    const maxStars = 5;

    for (let i = 1; i <= maxStars; i++) {
      // Determinar si la estrella debe estar llena, media o vacía
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
