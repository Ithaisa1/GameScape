import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGameContext } from '../hooks/useGameContext';
import { useAuthContext } from '../hooks/useAuthContext';
import StoreButtons from '../components/StoreButtons/StoreButtons';
import StarRating from '../components/StarRating/StarRating';
import ReviewList from '../components/ReviewList/ReviewList';
import '../styles/GameDetail.css';

export default function GameDetail() {
  const { id } = useParams();

  const {
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    gameDetail,
    gameDetailLoading,
    gameDetailError,
    fetchGameDetail
  } = useGameContext();

  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (id) fetchGameDetail(id);
  }, [id, fetchGameDetail]);

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (isFavorite(gameDetail?.id)) {
      removeFromFavorites(gameDetail?.id);
    } else {
      addToFavorites(gameDetail);
    }
  };

  if (gameDetailLoading) {
    return <div className="game-detail__loading">Cargando...</div>;
  }

  if (gameDetailError || !gameDetail) {
    return <div className="game-detail__error"></div>;
  }

  return (
    <div className="game-detail">
      
      {/* HEADER */}
      <div className="game-detail__header">

        {/* MEDIA */}
        <div className="game-detail__media">
          {gameDetail.clip?.clips?.length > 0 ? (
            <video
              className="game-detail__video"
              controls
              muted
              loop
              poster={gameDetail.background_image}
            >
              <source src={gameDetail.clip.clips[0]} type="video/mp4" />
            </video>
          ) : (
            <img
              className="game-detail__image"
              src={gameDetail.background_image || '/placeholder-game.jpg'}
              alt={gameDetail.name}
            />
          )}
        </div>

        {/* INFO */}
        <div className="game-detail__info">

          <div className="game-detail__title-row">
            <h1 className="game-detail__title">{gameDetail.name}</h1>

            {gameDetail.released && (
              <span className="game-detail__year">
                {new Date(gameDetail.released).getFullYear()}
              </span>
            )}
          </div>

          <div className="game-detail__rating">
            {gameDetail.rating?.toFixed(1) || 'N/A'}
          </div>

          <button
            className={`game-detail__favorite-btn ${
              isFavorite(gameDetail.id) ? 'favorite' : ''
            }`}
            onClick={handleToggleFavorite}
          >
            {isFavorite(gameDetail.id) ? 'Quitar' : 'Agregar'}
          </button>

          {/* DESCRIPCIÓN */}
          <div className="game-detail__section">
            <h3>Descripción</h3>
            <p>
              {gameDetail.description_raw
                ? gameDetail.description_raw.substring(0, 300) +
                  (gameDetail.description_raw.length > 300 ? '...' : '')
                : 'No hay descripción disponible.'}
            </p>
          </div>

          {/* GENEROS */}
          <div className="game-detail__section">
            <h3>Géneros</h3>
            <div className="game-detail__genres">
              {gameDetail.genres?.map((genre) => (
                <span key={genre.id} className="game-detail__genre">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          {/* TAGS */}
          <div className="game-detail__section">
            <h3>Características</h3>
            <div className="game-detail__tags">
              {gameDetail.tags?.slice(0, 10).map((tag) => (
                <span key={tag.id} className="game-detail__tag">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>

          {/* STORES */}
          {gameDetail.stores?.length > 0 && (
            <div className="game-detail__section">
              <h3>Tiendas</h3>
              <StoreButtons stores={gameDetail.stores} />
            </div>
          )}

          {/* PLATFORMS */}
          {gameDetail.platforms?.length > 0 && (
            <div className="game-detail__section">
              <h3>Plataformas</h3>
              <div className="game-detail__platforms">
                {Array.from(
                  new Set(
                    gameDetail.platforms.map((p) => p.platform.name)
                  )
                ).map((name, i) => (
                  <span key={i} className="game-detail__platform">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* REVIEWS */}
      <ReviewList gameId={gameDetail.id} gameName={gameDetail.name} />
    </div>
  );
}
