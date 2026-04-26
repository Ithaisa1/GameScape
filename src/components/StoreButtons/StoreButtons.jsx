/**
 * @file StoreButtons.jsx
 * @description Componente que muestra botones de tiendas donde está disponible un juego.
 *              Muestra logos de tiendas (Steam, PlayStation, Xbox, etc.) con enlaces a sus páginas.
 * @module Components
 */

import React from 'react';
import styles from './StoreButtons.module.css';

// Importar logos directamente desde assets
import steamLogo from '../../assets/stores/logo-steam.png';
import microsoftStoreLogo from '../../assets/stores/logo-microsoft-store.png';
import xboxLogo from '../../assets/stores/logo-xbox.png';
import playstationLogo from '../../assets/stores/logo-playstation.png';
import gogLogo from '../../assets/stores/logo-gog.png';
import epicGamesLogo from '../../assets/stores/logo-epic-games.png';
import nintendoLogo from '../../assets/stores/logo-nintendo.png';
import eaLogo from '../../assets/stores/logo-ea.png';
import ubisoftLogo from '../../assets/stores/logo-ubisoft.png';
import activisionBlizzardLogo from '../../assets/stores/logo-activision-blizzard.png';

/**
 * @function getStoreName
 * @description Mapea el ID de tienda de la API RAWG al nombre legible de la tienda
 * @param {number} storeId - ID de la tienda según la API RAWG
 * @returns {string} Nombre legible de la tienda
 */
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

/**
 * @function getStoreClass
 * @description Mapea el ID de tienda a una clase CSS para estilos específicos
 * @param {number} storeId - ID de la tienda según la API RAWG
 * @returns {string} Nombre de clase CSS para estilos específicos de la tienda
 */
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

/**
 * @function getStoreLogo
 * @description Mapea el ID de tienda al logo correspondiente importado
 * @param {number} storeId - ID de la tienda según la API RAWG
 * @returns {string} Ruta del logo de la tienda
 */
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

/**
 * @component StoreButtons
 * @description Muestra botones de las tiendas donde está disponible un juego. Cada botón incluye
 *              el logo de la tienda y un enlace para comprar el juego. Si no hay tiendas disponibles,
 *              muestra un mensaje indicándolo.
 *
 * @param {Object} props
 * @param {Array} props.stores - Array de tiendas obtenidas de la API RAWG
 *
 * @returns {JSX.Element} Grid de botones de tiendas con logos y enlaces
 */
export default function StoreButtons({ stores }) {
    // Logs para debugging - pueden eliminarse en producción
    console.log('StoreButtons - stores recibidos:', stores);
    console.log('StoreButtons - stores length:', stores?.length);
    
    // Si no hay tiendas disponibles, mostrar mensaje
    if (!stores || stores.length === 0){
        return (
            <div className={styles.storeButtonsNoStores}>
                No hay tiendas disponibles para este juego
            </div>
        );
    }
    
    return (
        <div className={styles.storeButtons}>
            {stores.map((store) => (
                <a 
                    key={store.store_id || store.id} 
                    href={store.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`${styles.storeButtonsBtn} ${styles[`storeButtonsBtn${getStoreClass(store.store_id).charAt(0).toUpperCase() + getStoreClass(store.store_id).slice(1)}`]}`}
                >
                    <div className={styles.storeButtonsContent}>
                        <img 
                            src={getStoreLogo(store.store_id)} 
                            alt={getStoreName(store.store_id)}
                            className={styles.storeButtonsLogo}
                            // Si el logo falla al cargar, ocultar la imagen y mostrar solo el nombre
                            onError={(e) => {
                                e.target.style.display = 'none';
                                console.error(`Error loading logo for store ${store.store_id}`);
                            }}
                        />
                        <span className={styles.storeButtonsName}>
                            {getStoreName(store.store_id)}
                        </span>
                    </div>
                </a>
            ))}
        </div>
    );
}