import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import GameDetail from '../pages/GameDetail';
import Favorites from '../pages/Favorites';
 
function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/games/:id" element={<GameDetail />} />
      <Route path="/favorites" element={<Favorites />} />
    </Routes>
  );
}
 
export default AppRouter;