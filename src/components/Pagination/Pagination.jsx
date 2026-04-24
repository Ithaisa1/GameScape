import styles from './Pagination.module.css';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Responsive page range based on screen size (simulated)
  const getPagesToShow = () => {
    // Simulate responsive behavior - in real app would use window.innerWidth
    const isMobile = window.innerWidth < 576;
    const isTablet = window.innerWidth >= 576 && window.innerWidth < 768;
    
    if (isMobile) return 5;  // Mobile: show 5 pages
    if (isTablet) return 7;  // Tablet: show 7 pages
    return 10; // Desktop: show 10 pages
  };

  const maxPagesToShow = getPagesToShow();
  let startPage = 1;
  let endPage = totalPages;

  if (totalPages > maxPagesToShow) {
    // Calculate start and end based on current page
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

  // Generate page numbers to show
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

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
