/**
 * @file Loader.jsx
 * @description Componente de carga que muestra un esqueleto de tarjetas de juegos mientras se cargan los datos.
 *              Utiliza animaciones CSS para simular el contenido que se está cargando.
 * @module Components
 */

import styles from './Loader.module.css';

/**
 * @component Loader
 * @description Componente de carga que muestra 8 tarjetas esqueleto para simular el contenido
 *              de juegos mientras se obtienen de la API. Mejora la experiencia de usuario
 *              mostrando una estructura visual antes de que los datos reales estén disponibles.
 *
 * @returns {JSX.Element} Grid de tarjetas esqueleto con animaciones de carga
 */
export default function Loader() {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.skeletonGrid}>
        {/* Generar 8 tarjetas esqueleto para simular el contenido de juegos */}
        {[...Array(8)].map((_, index) => (
          <div key={index} className={styles.skeletonCard}>
            <div className={styles.skeletonImage}></div>
            <div className={styles.skeletonContent}>
              <div className={styles.skeletonTitle}></div>
              <div className={styles.skeletonMeta}>
                <div className={styles.skeletonRating}></div>
                <div className={styles.skeletonYear}></div>
              </div>
              <div className={styles.skeletonGenres}>
                <div className={styles.skeletonGenre}></div>
                <div className={styles.skeletonGenre}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}