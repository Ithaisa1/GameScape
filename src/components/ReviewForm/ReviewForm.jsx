/**
 * @file ReviewForm.jsx
 * @description Componente de formulario para añadir o editar reseñas de juegos.
 *              Valida la calificación y el texto antes de guardar en localStorage.
 * @module Components
 */

import React, { useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNotifications } from '../../context/NotificationProvider';
import StarRating from '../StarRating/StarRating';
import styles from './ReviewForm.module.css';

/**
 * @component ReviewForm
 * @description Formulario para añadir o editar reseñas de juegos. Valida que el usuario esté autenticado,
 *              que haya seleccionado una calificación y que el texto tenga al menos 10 caracteres.
 *              Las reseñas se guardan en localStorage.
 *
 * @param {Object} props
 * @param {string|number} props.gameId - ID del juego
 * @param {string} props.gameName - Nombre del juego
 * @param {Function} props.onReviewSubmitted - Callback que se ejecuta al enviar la reseña
 * @param {Object} [props.existingReview=null] - Reseña existente si se está editando
 *
 * @returns {JSX.Element} Formulario de reseña con calificación y texto
 *
 * Estado interno:
 * - rating: Calificación seleccionada (0-5)
 * - reviewText: Texto de la reseña
 * - isSubmitting: Boolean que indica si se está enviando
 * - showForm: Boolean para mostrar/ocultar el formulario
 */
export default function ReviewForm({ gameId, gameName, onReviewSubmitted, existingReview = null }) {
  const { user, isAuthenticated } = useAuthContext();
  const { showNotification } = useNotifications();
  
  // Calificación seleccionada (0 si no hay selección)
  const [rating, setRating] = useState(existingReview?.rating || 0);
  // Texto de la reseña
  const [reviewText, setReviewText] = useState(existingReview?.text || '');
  // Estado de envío del formulario
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Control de visibilidad del formulario
  const [showForm, setShowForm] = useState(false);

  /**
   * @function handleSubmit
   * @description Maneja el envío del formulario de reseña. Valida autenticación, calificación y texto
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que el usuario esté autenticado
    if (!isAuthenticated) {
      showNotification('Debes iniciar sesión para dejar una reseña', 'error');
      return;
    }

    // Validar que se haya seleccionado una calificación
    if (rating === 0) {
      showNotification('Por favor selecciona una calificación', 'error');
      return;
    }

    // Validar que el texto tenga al menos 10 caracteres
    if (reviewText.trim().length < 10) {
      showNotification('La reseña debe tener al menos 10 caracteres', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Obtener reseñas existentes del juego desde localStorage
      const existingReviews = JSON.parse(localStorage.getItem(`gameReviews_${gameId}`) || '[]');
      
      // Crear nueva reseña o actualizar la existente
      const newReview = {
        id: existingReview?.id || Date.now().toString(),
        gameId,
        gameName,
        userId: user.id,
        userName: user.name || user.nick,
        userNick: user.nick,
        rating,
        text: reviewText.trim(),
        // Si es edición, mantener la fecha original, si es nueva, usar fecha actual
        createdAt: existingReview?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        helpful: existingReview?.helpful || 0,
        notHelpful: existingReview?.notHelpful || 0
      };

      let updatedReviews;
      if (existingReview) {
        // Actualizar reseña existente
        updatedReviews = existingReviews.map(review => 
          review.id === existingReview.id ? newReview : review
        );
        showNotification('Reseña actualizada correctamente', 'success');
      } else {
        // Añadir nueva reseña
        updatedReviews = [...existingReviews, newReview];
        showNotification('Reseña publicada correctamente', 'success');
      }

      // Guardar en localStorage
      localStorage.setItem(`gameReviews_${gameId}`, JSON.stringify(updatedReviews));

      // También guardar en reseñas del usuario
      const userReviews = JSON.parse(localStorage.getItem(`userReviews_${user.id}`) || '[]');
      let updatedUserReviews;
      if (existingReview) {
        updatedUserReviews = userReviews.map(review => 
          review.id === existingReview.id ? newReview : review
        );
      } else {
        updatedUserReviews = [...userReviews, newReview];
      }
      localStorage.setItem(`userReviews_${user.id}`, JSON.stringify(updatedUserReviews));

      // Resetear formulario
      if (!existingReview) {
        setRating(0);
        setReviewText('');
        setShowForm(false);
      }

      // Notificar al componente padre
      if (onReviewSubmitted) {
        onReviewSubmitted(newReview);
      }

    } catch (error) {
      console.error('Error al guardar reseña:', error);
      showNotification('Error al guardar la reseña', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setRating(existingReview?.rating || 0);
    setReviewText(existingReview?.text || '');
    setShowForm(false);
  };

  if (!showForm && !existingReview) {
    return (
      <div className={styles.reviewFormTrigger}>
        <button 
          className={styles.reviewFormTriggerBtn}
          onClick={() => setShowForm(true)}
          disabled={!isAuthenticated}
        >
          {isAuthenticated ? '✍️ Escribir una reseña' : '🔒 Inicia sesión para reseñar'}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.reviewForm}>
      <div className={styles.reviewFormHeader}>
        <h3 className={styles.reviewFormTitle}>
          {existingReview ? '✏️ Editar tu reseña' : '✍️ Escribe una reseña'}
        </h3>
        {existingReview && (
          <button 
            className={styles.reviewFormCancelBtn}
            onClick={handleCancel}
          >
            Cancelar
          </button>
        )}
      </div>

      {!isAuthenticated && (
        <div className={styles.reviewFormAuthNotice}>
          <p>Debes <a href="/login">iniciar sesión</a> para dejar una reseña</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.reviewFormForm}>
        <div className={styles.reviewFormRating}>
          <label className={styles.reviewFormLabel}>Tu calificación:</label>
          <StarRating 
            rating={rating}
            onRatingChange={setRating}
            size="large"
            showValue={true}
            readonly={!isAuthenticated}
          />
        </div>

        <div className={styles.reviewFormText}>
          <label htmlFor="review-text" className={styles.reviewFormLabel}>
            Tu reseña:
          </label>
          <textarea
            id="review-text"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder={`¿Qué te pareció ${gameName}? Cuéntale a otros jugadores tu experiencia...`}
            className={styles.reviewFormTextarea}
            rows={4}
            maxLength={1000}
            disabled={!isAuthenticated}
            required
          />
          <div className={styles.reviewFormCharCount}>
            {reviewText.length}/1000 caracteres
          </div>
        </div>

        <div className={styles.reviewFormActions}>
          <button
            type="button"
            className={styles.reviewFormCancelBtn}
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={styles.reviewFormSubmitBtn}
            disabled={!isAuthenticated || isSubmitting}
          >
            {isSubmitting ? 'Publicando...' : (existingReview ? 'Actualizar' : 'Publicar')}
          </button>
        </div>
      </form>
    </div>
  );
}
