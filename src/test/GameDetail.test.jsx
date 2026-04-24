import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import GameDetail from '../pages/GameDetail';
import GameProvider from '../context/GameProvider';
import AuthProvider from '../context/AuthProvider';
import NotificationProvider from '../context/NotificationProvider';
import { ThemeProvider } from '../context/ThemeProvider';
import * as api from '../services/api';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock window.location
delete window.location;
window.location = { href: '' };

// Mock the API module
vi.mock('../services/api', () => ({
  getGameById: vi.fn(),
  getGameStores: vi.fn(),
}));

const mockGameDetail = {
  id: 1,
  name: 'Test Game',
  description_raw: 'This is a test game description that is long enough to test the truncation feature.',
  background_image: 'https://example.com/image.jpg',
  rating: 4.5,
  released: '2023-01-01',
  genres: [{ id: 1, name: 'Action' }, { id: 2, name: 'RPG' }],
  tags: [{ id: 1, name: 'Singleplayer' }, { id: 2, name: 'Multiplayer' }],
  platforms: [{ platform: { name: 'PC' } }, { platform: { name: 'PlayStation' } }],
  stores: [{ id: 1, store: { name: 'Steam' } }],
  clip: null,
};

const AllProviders = ({ children }) => (
  <ThemeProvider>
    <NotificationProvider>
      <AuthProvider>
        <GameProvider>
          {children}
        </GameProvider>
      </AuthProvider>
    </NotificationProvider>
  </ThemeProvider>
);

describe('GameDetail', () => {

  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.getItem.mockReturnValue('[]');
    window.location.href = '';
    vi.clearAllMocks();
  });

  it('muestra el estado de carga inicialmente', () => {
    api.getGameById.mockImplementation(() => new Promise(() => {}));
    api.getGameStores.mockImplementation(() => new Promise(() => {}));

    render(
      <AllProviders>
        <MemoryRouter initialEntries={['/game/1']}>
          <Routes>
            <Route path="/game/:id" element={<GameDetail />} />
          </Routes>
        </MemoryRouter>
      </AllProviders>
    );

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('renderiza correctamente el detalle del juego', async () => {
    api.getGameById.mockResolvedValue(mockGameDetail);
    api.getGameStores.mockResolvedValue({ results: mockGameDetail.stores });

    render(
      <AllProviders>
        <MemoryRouter initialEntries={['/game/1']}>
          <Routes>
            <Route path="/game/:id" element={<GameDetail />} />
          </Routes>
        </MemoryRouter>
      </AllProviders>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Game')).toBeInTheDocument();
    });

    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('RPG')).toBeInTheDocument();
  });

  it('muestra el botón de favoritos', async () => {
    api.getGameById.mockResolvedValue(mockGameDetail);
    api.getGameStores.mockResolvedValue({ results: mockGameDetail.stores });

    render(
      <AllProviders>
        <MemoryRouter initialEntries={['/game/1']}>
          <Routes>
            <Route path="/game/:id" element={<GameDetail />} />
          </Routes>
        </MemoryRouter>
      </AllProviders>
    );

    await waitFor(() => {
      expect(screen.getByText('Agregar')).toBeInTheDocument();
    });
  });

  it('muestra vídeo cuando hay clip disponible', async () => {
    const gameWithVideo = {
      ...mockGameDetail,
      clip: {
        clips: ['https://example.com/video.mp4']
      }
    };

    api.getGameById.mockResolvedValue(gameWithVideo);
    api.getGameStores.mockResolvedValue({ results: mockGameDetail.stores });

    render(
      <AllProviders>
        <MemoryRouter initialEntries={['/game/1']}>
          <Routes>
            <Route path="/game/:id" element={<GameDetail />} />
          </Routes>
        </MemoryRouter>
      </AllProviders>
    );

    await waitFor(() => {
      const video = screen.getByTestId('game-video'); // 👈 clave
      expect(video).toBeInTheDocument();
    });
  });

  it('muestra imagen cuando no hay vídeo', async () => {
    api.getGameById.mockResolvedValue(mockGameDetail);
    api.getGameStores.mockResolvedValue({ results: mockGameDetail.stores });

    render(
      <AllProviders>
        <MemoryRouter initialEntries={['/game/1']}>
          <Routes>
            <Route path="/game/:id" element={<GameDetail />} />
          </Routes>
        </MemoryRouter>
      </AllProviders>
    );

    await waitFor(() => {
      const imagen = screen.getByAltText('Test Game');
      expect(imagen).toBeInTheDocument();
    });
  });

  it('muestra la descripción (truncada)', async () => {
    api.getGameById.mockResolvedValue(mockGameDetail);
    api.getGameStores.mockResolvedValue({ results: mockGameDetail.stores });

    render(
      <AllProviders>
        <MemoryRouter initialEntries={['/game/1']}>
          <Routes>
            <Route path="/game/:id" element={<GameDetail />} />
          </Routes>
        </MemoryRouter>
      </AllProviders>
    );

    await waitFor(() => {
      expect(screen.getByText(/This is a test game description/)).toBeInTheDocument();
    });
  });

  it('muestra las plataformas', async () => {
    api.getGameById.mockResolvedValue(mockGameDetail);
    api.getGameStores.mockResolvedValue({ results: mockGameDetail.stores });

    render(
      <AllProviders>
        <MemoryRouter initialEntries={['/game/1']}>
          <Routes>
            <Route path="/game/:id" element={<GameDetail />} />
          </Routes>
        </MemoryRouter>
      </AllProviders>
    );

    await waitFor(() => {
      expect(screen.getByText('PC')).toBeInTheDocument();
      expect(screen.getByText('PlayStation')).toBeInTheDocument();
    });
  });

  it('muestra las tiendas cuando están disponibles', async () => {
    api.getGameById.mockResolvedValue(mockGameDetail);
    api.getGameStores.mockResolvedValue({ results: mockGameDetail.stores });

    render(
      <AllProviders>
        <MemoryRouter initialEntries={['/game/1']}>
          <Routes>
            <Route path="/game/:id" element={<GameDetail />} />
          </Routes>
        </MemoryRouter>
      </AllProviders>
    );

    await waitFor(() => {
      expect(screen.getByText('Tiendas')).toBeInTheDocument();
    });
  });

  it('maneja errores de API correctamente', async () => {
    api.getGameById.mockRejectedValue(new Error('Error'));
    api.getGameStores.mockRejectedValue(new Error('Error'));

    render(
      <AllProviders>
        <MemoryRouter initialEntries={['/game/1']}>
          <Routes>
            <Route path="/game/:id" element={<GameDetail />} />
          </Routes>
        </MemoryRouter>
      </AllProviders>
    );

    await waitFor(() => {
      expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();
    });
  });

});