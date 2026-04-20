import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/games/:id" element={<h1>Detalle Juego</h1>} />
      <Route path="/favorites" element={<h1>Favoritos</h1>} />
    </Routes>
  );
}

export default AppRouter;
