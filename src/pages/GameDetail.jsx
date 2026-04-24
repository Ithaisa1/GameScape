import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import {useGameContext} from '../hooks/useGameContext';
import {useAuthContext} from '../hooks/useAuthContext';
import { getGameById } from '../services/api';
// CSS eliminado - GameDetail.jsx usa estilos de componentes hijos
import StoreButtons from '../components/StoreButtons/StoreButtons';
import StarRating from '../components/StarRating/StarRating';
import ReviewList from '../components/ReviewList/ReviewList';

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
      </div>
    );
  }

    return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderRadius: '15px', alignItems: 'flex-start', gap: '3rem', marginBottom: '3rem', padding: '2rem', display: 'flex', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)' }}>
        <div style={{ flex: '1', maxWidth: window.innerWidth < 768 ? '100%' : '600px' }}>
          {gameDetail.clip && gameDetail.clip.clips && gameDetail.clip.clips.length > 0 ? (
            <video 
              style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
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
              style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
            />
          )}
        </div>
        
        <div style={{ flex: '1', color: '#fff' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: '#fff' }}>{gameDetail.name}</h1>
              {gameDetail.released && (
                <span style={{ background: '#5B8CFF', color: '#fff', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '500' }}>
                  {new Date(gameDetail.released).getFullYear()}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#34d39933', padding: '1rem', borderRadius: '10px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#34d399' }}>
                  {gameDetail.rating?.toFixed(1) || 'N/A'}
                </span>
              </div>
            </div>
            <button 
              style={{ 
                background: isFavorite(gameDetail.id) ? '#e74c3c' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                color: '#fff', 
                border: 'none', 
                padding: '0.75rem 1.5rem', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                fontSize: '1rem', 
                fontWeight: '500',
                transition: 'all 0.3s ease',
                marginBottom: '1.5rem'
              }}
              onClick={handleToggleFavorite}
            >
              {isFavorite(gameDetail.id) ? 'Quitar' : 'Agregar'}
            </button>
          </div>
          
          <div style={{ WebkitBackdropFilter: 'blur(10px)', backdropFilter: 'blur(10px)', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 1rem 0', color: '#fff' }}>Descripción</h3>
            <p style={{ fontSize: '1rem', color: '#ccc', lineHeight: '1.6' }}>{gameDetail.description_raw ? gameDetail.description_raw.substring(0, 300) + (gameDetail.description_raw.length > 300 ? '...' : '') : 'No hay descripción disponible.'}</p>
          </div>
          
          <div style={{ WebkitBackdropFilter: 'blur(10px)', backdropFilter: 'blur(10px)', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 1rem 0', color: '#fff' }}>Géneros</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {gameDetail.genres?.map(genre => (
                <span key={genre.id} style={{ color: '#fff', borderRadius: '20px', padding: '0.5rem 1rem', fontSize: '0.9rem', fontWeight: '500', background: '#5B8CFF' }}>
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
          
          <div style={{ WebkitBackdropFilter: 'blur(10px)', backdropFilter: 'blur(10px)', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 1rem 0', color: '#fff' }}>Características</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {gameDetail.tags?.slice(0, 10).map(tag => (
                <span key={tag.id} style={{ background: 'linear-gradient(135deg, #171A21, #222734)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '500' }}>
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
          
          {gameDetail.stores && gameDetail.stores.length > 0 && (
            <div style={{ WebkitBackdropFilter: 'blur(10px)', backdropFilter: 'blur(10px)', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 1rem 0', color: '#fff' }}>Tiendas</h3>
              <StoreButtons stores={gameDetail.stores} />
            </div>
          )}
          
          {gameDetail.platforms && gameDetail.platforms.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 1rem 0', color: '#fff' }}>Plataformas</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
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
                        <span key={`${platformName}-${index}`} style={{ background: 'linear-gradient(145deg, #222734, #171A21)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '15px', fontSize: '0.9rem', border: '1px solid #444' }}>
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
      
      {/* Sección de reseñas */}
      <ReviewList gameId={gameDetail.id} gameName={gameDetail.name} />
    </div>
  );
}