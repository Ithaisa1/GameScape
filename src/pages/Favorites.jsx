import { useGameContext } from '../hooks/useGameContext';
import { Link } from 'react-router-dom';
import GameCard from '../components/GameCard/GameCard';
import SearchHistory from '../components/SearchHistory/SearchHistory';
import '../styles/Favorites.css';

/**
 * @component Favorites
 * @description Página que muestra la lista de juegos favoritos del usuario autenticado.
 *              Muestra un estado vacío si no hay favoritos, o una grilla con las tarjetas
 *              de juegos favoritos. También muestra el historial de búsquedas.
 *
 * Estado interno:
 * - Utiliza useGameContext para acceder a la lista de favoritos
 *
 * @returns {JSX.Element} Página de favoritos con grilla de juegos o estado vacío
 */
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