import { useGameContext } from '../hooks/useGameContext';
import { Link } from 'react-router-dom';
import GameCard from '../components/GameCard/GameCard';
import SearchHistory from '../components/SearchHistory/SearchHistory';
// CSS eliminado - Favorites.jsx usa estilos de componentes hijos

export default function Favorites(){
    const { favorites } = useGameContext();

    if(favorites.length === 0){
        return(
            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', padding: '3rem', background: 'linear-gradient(145deg, #171A21, #222734)', borderRadius: '15px', border: '1px solid #333' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', background: 'linear-gradient(45deg, #5B8CFF, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>No tienes juegos favoritos</h1>
                    <p style={{ fontSize: '1.2rem', color: '#B8BDC9', marginBottom: '2rem' }}>Agrega juegos a tus favoritos para verlos aquí</p>
                    <Link 
                      to ="/" 
                      style={{ 
                        background: '#5B8CFF', 
                        color: '#fff', 
                        padding: '0.75rem 1.5rem', 
                        borderRadius: '8px', 
                        textDecoration: 'none', 
                        fontWeight: '500', 
                        transition: 'all 0.3s ease',
                        display: 'inline-block'
                      }}
                    >
                      Explorar juegos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', background: 'linear-gradient(45deg, #5B8CFF, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Mis Favoritos ({favorites.length})
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#B8BDC9', marginBottom: '2rem' }}>
                    Los juegos que has marcado como favoritos
                </p>
            </div>

            <SearchHistory />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                {favorites.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        </div>
    );
}