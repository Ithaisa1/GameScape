import { useGameContext } from '../hooks/useGameContext';
import { Link } from 'react-router-dom';
import GameCard from '../components/GameCard/GameCard';
import SearchHistory from '../components/SearchHistory/SearchHistory';
import '../styles/Favorites.css';

export default function Favorites(){
    const { favorites } = useGameContext();

    if(favorites.length === 0){
        return(
            <div className="favorites">
                <div className="favorites__empty">
                    <h1 className="favorites__empty-title">No tienes juegos favoritos</h1>
                    <p className="favorites__empty-description">Agrega juegos a tus favoritos para verlos aquí</p>
                    <Link to="/" className="favorites__btn">
                        Explorar juegos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="favorites">
            <div className="favorites__header">
                <h1 className="favorites__title">
                    Mis Favoritos ({favorites.length})
                </h1>
                <p className="favorites__subtitle">
                    Los juegos que has marcado como favoritos
                </p>
            </div>

            <SearchHistory />

            <div className="favorites__grid">
                {favorites.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        </div>
    );
}