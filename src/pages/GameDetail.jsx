import {useParams} from 'react-router-dom';
import {useEffect } from 'react';
import {useGameContext} from '../hooks/useGameContext';
import {useAuthContext} from '../hooks/useAuthContext';
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
      <div className="game-detail__main-content">
        <div className="game-detail__media-section">
          <div className="game-detail__media-container">
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
                className="game-detail__main-image"
              />
            )}
          </div>
        </div>
        
        <div className="game-detail__info-section">
          <div className="game-detail__header-info">
            <h1 className="game-detail__title">{gameDetail.name}</h1>
            <div className="game-detail__meta-separated">
              <div className="game-detail__rating-box">
                <span className="game-detail__rating">
                  {gameDetail.rating?.toFixed(1) || 'N/A'}
                </span>
              </div>
              <div className="game-detail__released-box">
                <span className="game-detail__released">
                  Año de lanzamiento: {new Date(gameDetail.released).getFullYear()}
                </span>
              </div>
            </div>
            <button 
              className={`game-detail__favorite-btn ${isFavorite(gameDetail.id) ? 'favorite' : ''}`}
              onClick={handleToggleFavorite}
            >
              {isFavorite(gameDetail.id) ? '💛' : '🤍'} {isFavorite(gameDetail.id) ? 'Quitar' : 'Agregar'}
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
          
          <div className="game-detail__platforms-section">
            <h3>Plataformas</h3>
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
                
                return Array.from(platformMap.values()).map((platformName, index) => (
                  <span key={`${platformName}-${index}`} className="game-detail__platform">
                    {platformName}
                  </span>
                ));
              })()}
            </div>
          </div>
          
          <div className="game-detail__platform-buttons">
            <h3>Disponible en</h3>
            <div className="game-detail__store-buttons">
              {(() => {
                const storeMap = new Map();
                const hasSteam = gameDetail.platforms?.some(p => p.platform.name.toLowerCase().includes('steam'));
                const hasPlayStation = gameDetail.platforms?.some(p => p.platform.name.toLowerCase().includes('playstation'));
                const hasXbox = gameDetail.platforms?.some(p => p.platform.name.toLowerCase().includes('xbox'));
                const hasNintendo = gameDetail.platforms?.some(p => p.platform.name.toLowerCase().includes('nintendo'));
                const hasEpic = gameDetail.platforms?.some(p => p.platform.name.toLowerCase().includes('epic'));
                
                gameDetail.platforms?.forEach(platform => {
                  const platformName = platform.platform.name.toLowerCase();
                  
                  if (hasSteam && platformName.includes('steam')) {
                    storeMap.set('Steam', (
                      <a 
                        key="steam"
                        href={`https://store.steampowered.com/app/${gameDetail.steam_appid || ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="game-detail__store-btn steam"
                      >
                        Steam
                      </a>
                    ));
                  } else if (hasPlayStation && (platformName.includes('playstation 4') || platformName.includes('playstation 5') || platformName.includes('ps4') || platformName.includes('ps5'))) {
                    storeMap.set('PlayStation', (
                      <a 
                        key="playstation"
                        href={`https://store.playstation.com/product/${gameDetail.slug || ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="game-detail__store-btn playstation"
                      >
                        PlayStation
                      </a>
                    ));
                  } else if (hasXbox && (platformName.includes('xbox one') || platformName.includes('xbox series x') || platformName.includes('xbox series s'))) {
                    storeMap.set('Xbox', (
                      <a 
                        key="xbox"
                        href={`https://www.xbox.com/es-ES/games/search?q=${encodeURIComponent(gameDetail.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="game-detail__store-btn xbox"
                      >
                        Xbox
                      </a>
                    ));
                  } else if (hasNintendo && platformName.includes('nintendo')) {
                    storeMap.set('Nintendo', (
                      <a 
                        key="nintendo"
                        href={`https://www.nintendo.com/es-es/search?q=${encodeURIComponent(gameDetail.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="game-detail__store-btn nintendo"
                      >
                        Nintendo
                      </a>
                    ));
                  } else if (hasEpic && platformName.includes('epic')) {
                    storeMap.set('Epic Games', (
                      <a 
                        key="epic"
                        href={`https://store.epicgames.com/p/${gameDetail.slug || ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="game-detail__store-btn epic"
                      >
                        Epic Games
                      </a>
                    ));
                  }
                });
                
                const storeButtons = Array.from(storeMap.values());
                
                if (storeButtons.length === 0) {
                  return (
                    <div className="game-detail__no-stores">
                      <span>Información de tiendas no disponible</span>
                    </div>
                  );
                }
                
                return storeButtons;
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}