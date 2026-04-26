/**
 * @file Pagination.jsx
 * @description Componente de paginación que permite navegar entre páginas de resultados de juegos.
 *              Adapta el número de páginas visibles según el tamaño de la pantalla.
 * @module Components
 */

import styles from './Pagination.module.css';

/**
 * @component Pagination
 * @description Componente de paginación con botones anterior/siguiente y números de página.
 *              Adapta el rango de páginas visibles según el tamaño de la pantalla (móvil: 5, tablet: 7, desktop: 10).
 *
 * @param {Object} props
 * @param {number} props.currentPage - Página actual seleccionada
 * @param {number} props.totalPages - Total de páginas disponibles
 * @param {Function} props.onPageChange - Callback que se ejecuta al cambiar de página
 *
 * @returns {JSX.Element} Componente de paginación con botones y números de página
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  /**
   * @function getPagesToShow
   * @description Determina cuántas páginas mostrar según el ancho de la pantalla
   * @returns {number} Número de páginas a mostrar (5 para móvil, 7 para tablet, 10 para desktop)
   */
  const getPagesToShow = () => {
    // Simular comportamiento responsive - en una app real usaría un hook de media query
    const isMobile = window.innerWidth < 576;
    const isTablet = window.innerWidth >= 576 && window.innerWidth < 768;
    
    if (isMobile) return 5;  // Mobile: show 5 pages
    if (isTablet) return 7;  // Tablet: show 7 pages
    return 10; // Desktop: show 10 pages
  };

  const maxPagesToShow = getPagesToShow();
  let startPage = 1;
  let endPage = totalPages;

  // Si hay más páginas de las que se pueden mostrar, calcular el rango centrado en la página actual
  if (totalPages > maxPagesToShow) {
    // Calcular el rango de páginas a mostrar centrado en la página actual
    const halfRange = Math.floor(maxPagesToShow / 2);
    
    if (currentPage <= halfRange) {
      startPage = 1;
      endPage = maxPagesToShow;
    } else if (currentPage + halfRange >= totalPages) {
      startPage = totalPages - maxPagesToShow + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - halfRange;
      endPage = currentPage + halfRange;
    }
  }

  // Generar array de números de página a mostrar
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  /**
   * @function handlePrev
   * @description Navega a la página anterior si no estamos en la primera
   */
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  /**
   * @function handleNext
   * @description Navega a la página siguiente si no estamos en la última
   */
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={styles.pagination}>
      <button
        className={styles.paginationButton}
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        ← Anterior
      </button>

      <div className={styles.paginationNumbers}>
        {pages.map((page) => (
          <button
            key={page}
            className={`${styles.paginationPage} ${currentPage === page ? styles.active : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className={styles.paginationButton}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Siguiente →
      </button>
    </div>
  );
}
