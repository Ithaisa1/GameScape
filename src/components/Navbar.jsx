import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo">
        <h1>🎮 GameScape</h1>
      </Link>
      <div className="navbar__links">
        <Link to="/" className="navbar__link">
          Home
        </Link>
        <Link to="/favorites" className="navbar__link">
          Favorites
        </Link>
      </div>
    </nav>
  );
}