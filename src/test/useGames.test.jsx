import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useGames } from '../hooks/useGames';
import * as api from '../services/api';

// Mock the API module
vi.mock('../services/api');

describe('useGames', () => {
  it('fetches games successfully', async () => {
    const mockGames = {
      results: [
        { id: 1, name: 'Game 1' },
        { id: 2, name: 'Game 2' },
      ],
      count: 2,
    };

    api.getGames.mockResolvedValue(mockGames);

    const { result } = renderHook(() => useGames());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.games).toEqual(mockGames.results);
    expect(result.current.error).toBeNull();
  });

  it('handles API errors', async () => {
    api.getGames.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useGames());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('API Error');
    expect(result.current.games).toEqual([]);
  });

  it('calls searchGames when searchQuery is provided', async () => {
    const mockGames = {
      results: [{ id: 1, name: 'Search Result' }],
      count: 1,
    };

    api.searchGames.mockResolvedValue(mockGames);

    const { result } = renderHook(() => useGames('test query'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(api.searchGames).toHaveBeenCalledWith('test query', 1);
  });
});
