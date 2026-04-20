import '../styles/Pagination.css';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Calculate page range to show (max 10 pages)
  const maxPagesToShow = 10;
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
    <div className="pagination">
      <button
        className="pagination__button"
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        ← Anterior
      </button>

      <div className="pagination__numbers">
        {pages.map((page) => (
          <button
            key={page}
            className={`pagination__page ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <span className="pagination__info">
        {startPage}–{endPage} de {totalPages}
      </span>

      <button
        className="pagination__button"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Siguiente →
      </button>
    </div>
  );
}
