import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import {useGameContext} from '../hooks/useGameContext';
import {useAuthContext} from '../hooks/useAuthContext';
import { getGameById } from '../services/api';
import '../styles/GameDetail.css';
import StoreButtons from '../components/StoreButtons';
import StarRating from '../components/StarRating';
import ReviewList from '../components/ReviewList';

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
        if (id) {
            fetchGameDetail(id);
        }
    }, [id, fetchGameDetail]);

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      // Redirigir al login
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
    return (
      <div className="game-detail__error">
        <h2>Error</h2>
        <p>{gameDetailError || 'Juego no encontrado'}</p>
      </div>
    );
  }

    return (
    <div className="game-detail">
      <div className="game-detail__header">
        <div className="game-detail__image-container">
          {gameDetail.clip && gameDetail.clip.clips && gameDetail.clip.clips.length > 0 ? (
            <video 
              className="game-detail__video"
              controls
              muted
              loop
              poster={gameDetail.background_image}
            >
              <source src={gameDetail.clip.clips[0]} type="video/mp4" />
              Tu navegador no soporta videos HTML5.
            </video>
          ) : (
            <img 
              src={gameDetail.background_image || '/placeholder-game.jpg'} 
              alt={gameDetail.name}
              className="game-detail__image"
            />
          )}
        </div>
        
        <div className="game-detail__content">
          <div className="game-detail__header-info">
            <div className="game-detail__title-row">
              <h1 className="game-detail__title">{gameDetail.name}</h1>
              {gameDetail.released && (
                <span className="game-detail__year">
                  {new Date(gameDetail.released).getFullYear()}
                </span>
              )}
            </div>
            <div className="game-detail__meta-separated">
              <div className="game-detail__rating-box">
                <span className="game-detail__rating">
                  {gameDetail.rating?.toFixed(1) || 'N/A'}
                </span>
              </div>
            </div>
            <button 
              className={`game-detail__favorite-btn ${isFavorite(gameDetail.id) ? 'favorite' : ''}`}
              onClick={handleToggleFavorite}
            >
              {isFavorite(gameDetail.id) ? 'Quitar' : 'Agregar'}
            </button>
          </div>
          
          <div className="game-detail__description-section">
            <h3>Descripción</h3>
            <p>{gameDetail.description_raw ? gameDetail.description_raw.substring(0, 300) + (gameDetail.description_raw.length > 300 ? '...' : '') : 'No hay descripción disponible.'}</p>
          </div>
          
          <div className="game-detail__genres-section">
            <h3>Géneros</h3>
            <div className="game-detail__genres">
              {gameDetail.genres?.map(genre => (
                <span key={genre.id} className="game-detail__genre">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
          
          <div className="game-detail__tags-section">
            <h3>Características</h3>
            <div className="game-detail__tags">
              {gameDetail.tags?.slice(0, 10).map(tag => (
                <span key={tag.id} className="game-detail__tag">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
          
          {(() => {
            console.log('GameDetail - gameDetail.stores:', gameDetail.stores);
            console.log('GameDetail - gameDetail.platforms:', gameDetail.platforms);
            console.log('GameDetail - stores length:', gameDetail.stores?.length);
            console.log('GameDetail - platforms length:', gameDetail.platforms?.length);
            const hasStores = gameDetail.stores && gameDetail.stores.length > 0;
            const hasPlatforms = gameDetail.platforms && gameDetail.platforms.length > 0;
            console.log('GameDetail - hasStores:', hasStores);
            console.log('GameDetail - hasPlatforms:', hasPlatforms);
            console.log('GameDetail - should render section:', hasStores || hasPlatforms);
            return hasStores || hasPlatforms;
          })() && (
            <div className="game-detail__platforms-section">
              <h3>Dónde conseguir este juego:</h3>
              <div className="game-detail__platforms-and-stores">
                {/* Tiendas para comprar */}
                {gameDetail.stores && gameDetail.stores.length > 0 && (
                  <div className="game-detail__stores-subsection">
                    <h4>Comprar en:</h4>
                    <StoreButtons stores={gameDetail.stores} />
                  </div>
                )}
                
                {/* Plataformas para jugar */}
                {gameDetail.platforms && gameDetail.platforms.length > 0 && (
                  <div className="game-detail__platforms-subsection">
                    <h4>Disponible en:</h4>
                    <div className="game-detail__platforms">
                      {(() => {
                        const platformMap = new Map();
                        gameDetail.platforms?.forEach(platform => {
                          const platformName = platform.platform.name.toLowerCase();
                          let normalizedPlatform;
                          
                          if (platformName.includes('playstation 4') || platformName.includes('playstation 5') || platformName.includes('ps4') || platformName.includes('ps5')) {
                            normalizedPlatform = 'PlayStation';
                          } else if (platformName.includes('xbox one') || platformName.includes('xbox series x') || platformName.includes('xbox series s') || platformName.includes('xbox')) {
                            normalizedPlatform = 'Xbox';
                          } else if (platformName.includes('nintendo') || platformName.includes('switch') || platformName.includes('wii') || platformName.includes('gamecube')) {
                            normalizedPlatform = 'Nintendo';
                          } else if (platformName.includes('steam')) {
                            normalizedPlatform = 'Steam';
                          } else if (platformName.includes('epic')) {
                            normalizedPlatform = 'Epic Games';
                          } else if (platformName.includes('gog') || platformName.includes('good old games')) {
                            normalizedPlatform = 'GOG';
                          } else if (platformName.includes('origin')) {
                            normalizedPlatform = 'Origin';
                          } else if (platformName.includes('uplay') || platformName.includes('ubisoft')) {
                            normalizedPlatform = 'Ubisoft Connect';
                          } else if (platformName.includes('microsoft store') || platformName.includes('windows store')) {
                            normalizedPlatform = 'Microsoft Store';
                          } else if (platformName.includes('android') || platformName.includes('ios') || platformName.includes('mobile')) {
                            normalizedPlatform = 'Mobile';
                          } else if (platformName.includes('web') || platformName.includes('browser')) {
                            normalizedPlatform = 'Web';
                          } else {
                            normalizedPlatform = platform.platform.name;
                          }
                          
                          platformMap.set(normalizedPlatform, normalizedPlatform);
                        });
                        
                        return (
                          <React.Fragment>
                            {Array.from(platformMap.values()).map((platformName, index) => (
                              <span key={`${platformName}-${index}`} className="game-detail__platform">
                                {platformName}
                              </span>
                            ))}
                          </React.Fragment>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Sección de reseñas */}
      <ReviewList gameId={gameDetail.id} gameName={gameDetail.name} />
    </div>
  );
}