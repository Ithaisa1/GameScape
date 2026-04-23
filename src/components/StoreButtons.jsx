import React from 'react';
import '../styles/StoreButtons.css';

// Importar logos directamente
import steamLogo from '../assets/stores/logo-steam.png';
import microsoftStoreLogo from '../assets/stores/logo-microsoft-store.png';
import xboxLogo from '../assets/stores/logo-xbox.png';
import playstationLogo from '../assets/stores/logo-playstation.png';
import gogLogo from '../assets/stores/logo-gog.png';
import epicGamesLogo from '../assets/stores/logo-epic-games.png';
import nintendoLogo from '../assets/stores/logo-nintendo.png';
import eaLogo from '../assets/stores/logo-ea.png';
import ubisoftLogo from '../assets/stores/logo-ubisoft.png';
import activisionBlizzardLogo from '../assets/stores/logo-activision-blizzard.png';

// Mapeo de store_id a nombres de tiendas
const getStoreName = (storeId) => {
    const storeMap = {
        1: 'Steam',
        2: 'Microsoft Store', 
        3: 'PlayStation',
        4: 'GOG',
        5: 'Epic Games',
        6: 'Nintendo',
        7: 'Xbox',
        8: 'Origin',
        9: 'Ubisoft Connect',
        10: 'Battle.net',
        11: 'Epic Games'
    };
    return storeMap[storeId] || 'Tienda';
};

const getStoreClass = (storeId) => {
    const classMap = {
        1: 'steam',
        2: 'microsoft',
        3: 'playstation',
        4: 'gog',
        5: 'epic',
        6: 'nintendo',
        7: 'xbox',
        8: 'origin',
        9: 'ubisoft',
        10: 'battlenet',
        11: 'epic'
    };
    return classMap[storeId] || 'default';
};

const getStoreLogo = (storeId) => {
    const logoMap = {
        1: steamLogo,
        2: microsoftStoreLogo, // Microsoft Store con su propio logo
        3: playstationLogo,
        4: gogLogo,
        5: epicGamesLogo,
        6: nintendoLogo,
        7: xboxLogo,
        8: eaLogo, // Origin usa logo de EA
        9: ubisoftLogo, // Ubisoft
        10: activisionBlizzardLogo, // Battle.net
        11: epicGamesLogo
    };
    return logoMap[storeId] || steamLogo;
};

export default function StoreButtons({ stores }) {
    console.log('StoreButtons - stores recibidos:', stores);
    console.log('StoreButtons - stores length:', stores?.length);
    
    if (!stores || stores.length === 0){
        return (
            <div className="store-buttons__no-stores">
                No hay tiendas disponibles para este juego
            </div>
        );
    }
    
    return (
        <div className="store-buttons">
            {stores.map((store) => (
                <a 
                    key={store.store_id || store.id} 
                    href={store.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`store-buttons__btn store-buttons__btn--${getStoreClass(store.store_id)}`}
                >
                    <div className="store-buttons__content">
                        <img 
                            src={getStoreLogo(store.store_id)} 
                            alt={getStoreName(store.store_id)}
                            className="store-buttons__logo"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                        <span className="store-buttons__name">
                            {getStoreName(store.store_id)}
                        </span>
                    </div>
                </a>
            ))}
        </div>
    );
}