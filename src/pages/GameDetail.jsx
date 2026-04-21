import {useParams} from 'react-router-dom';
import {useState, useEffect } from 'react';
import {useGameContext} from '../context/useGameContext';
import {getGameById} from '../services/api';
import '../styles/GameDetail.css';

export default function GameDetail() {
    const { id } = useParams();
    const { addToFavorites, removeFromFavorites, isFavorite } = useGameContext();
    const [ game, setGame ] = useState(null);
    const [loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    useEffect(() => {
    const fetchGameDetail = async () => {
      try {
        setLoading(true);
        const gameData = await getGameById(id);
        setGame(gameData);
        setError(null);
      } catch (err) {
        setError('No se pudo cargar la información del juego');
        console.error('Error fetching game detail:', err);
      } finally {
        setLoading(false);
      }
    };
 
    if (id) {
      fetchGameDetail();
    }
  }, [id]);

  const handleToggleFavorite = () => {
    if (isFavorite(game.id)) {
      removeFromFavorites(game.id);
    } else {
      addToFavorites(game);
    }
  };

  if (loading) {
    return <div className="game-detail__loading">Cargando...</div>;
  }
 
  if (error || !game) {
    return (
      <div className="game-detail__error">
        <h2>Error</h2>
        <p>{error || 'Juego no encontrado'}</p>
      </div>
    );
  }

    return (
    <div className="game-detail">
      <div className="game-detail__main-content">
        <div className="game-detail__media-section">
          <div className="game-detail__media-container">
            {game.clip && game.clip.clips && game.clip.clips.length > 0 ? (
              <video 
                className="game-detail__video"
                controls
                muted
                loop
                poster={game.background_image}
              >
                <source src={game.clip.clips[0]} type="video/mp4" />
                Tu navegador no soporta videos HTML5.
              </video>
            ) : (
              <img 
                src={game.background_image || '/placeholder-game.jpg'} 
                alt={game.name}
                className="game-detail__main-image"
              />
            )}
          </div>
        </div>
        
        <div className="game-detail__info-section">
          <div className="game-detail__header-info">
            <h1 className="game-detail__title">{game.name}</h1>
            <div className="game-detail__meta-separated">
              <div className="game-detail__rating-box">
                <span className="game-detail__rating">
                  {game.rating?.toFixed(1) || 'N/A'}
                </span>
              </div>
              <div className="game-detail__released-box">
                <span className="game-detail__released">
                  {new Date(game.released).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button 
              className={`game-detail__favorite-btn ${isFavorite(game.id) ? 'favorite' : ''}`}
              onClick={handleToggleFavorite}
            >
              {isFavorite(game.id) ? '❤️' : '🤍'} {isFavorite(game.id) ? 'Quitar' : 'Agregar'}
            </button>
          </div>
          
          <div className="game-detail__description-section">
            <h3>Descripción</h3>
            <p>{game.description_raw ? game.description_raw.substring(0, 300) + (game.description_raw.length > 300 ? '...' : '') : 'No hay descripción disponible.'}</p>
          </div>
          
          <div className="game-detail__genres-section">
            <h3>Géneros</h3>
            <div className="game-detail__genres">
              {game.genres?.map(genre => (
                <span key={genre.id} className="game-detail__genre">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
          
          <div className="game-detail__tags-section">
            <h3>Características</h3>
            <div className="game-detail__tags">
              {game.tags?.slice(0, 10).map(tag => (
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
                game.platforms?.forEach(platform => {
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
                const hasSteam = game.platforms?.some(p => p.platform.name.toLowerCase().includes('steam'));
                const hasPlayStation = game.platforms?.some(p => p.platform.name.toLowerCase().includes('playstation'));
                const hasXbox = game.platforms?.some(p => p.platform.name.toLowerCase().includes('xbox'));
                const hasNintendo = game.platforms?.some(p => p.platform.name.toLowerCase().includes('nintendo'));
                const hasEpic = game.platforms?.some(p => p.platform.name.toLowerCase().includes('epic'));
                
                game.platforms?.forEach(platform => {
                  const platformName = platform.platform.name.toLowerCase();
                  
                  if (hasSteam && platformName.includes('steam')) {
                    storeMap.set('Steam', (
                      <a 
                        key="steam"
                        href={`https://store.steampowered.com/app/${game.steam_appid || ''}`}
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
                        href={`https://store.playstation.com/product/${game.slug || ''}`}
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
                        href={`https://www.xbox.com/es-ES/games/search?q=${encodeURIComponent(game.name)}`}
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
                        href={`https://www.nintendo.com/es-es/search?q=${encodeURIComponent(game.name)}`}
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
                        href={`https://store.epicgames.com/p/${game.slug || ''}`}
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