import '../styles/Loader.css';

export default function Loader() {
  return (
    <div className="loader-container">
      <div className="skeleton-grid">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-meta">
                <div className="skeleton-rating"></div>
                <div className="skeleton-year"></div>
              </div>
              <div className="skeleton-genres">
                <div className="skeleton-genre"></div>
                <div className="skeleton-genre"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}