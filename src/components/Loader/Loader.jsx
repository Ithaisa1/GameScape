import styles from './Loader.module.css';

export default function Loader() {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.skeletonGrid}>
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