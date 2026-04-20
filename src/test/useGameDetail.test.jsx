import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGameDetail } from '../hooks/useGameDetail';
import * as api from '../services/api';

// Mock the API module
vi.mock('../services/api');

describe('useGameDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not fetch when id is not provided', () => {
    const { result } = renderHook(() => useGameDetail(null));

    expect(result.current.loading).toBe(false);
    expect(api.getGameById).not.toHaveBeenCalled();
  });

  it('fetches game detail successfully', async () => {
    const mockGame = {
      id: 1,
      name: 'Test Game',
      description: 'Test description',
      rating: 4.5,
    };

    api.getGameById.mockResolvedValue(mockGame);

    const { result } = renderHook(() => useGameDetail(1));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.game).toEqual(mockGame);
    expect(result.current.error).toBeNull();
  });

  it('handles API errors', async () => {
    api.getGameById.mockRejectedValue(new Error('Game not found'));

    const { result } = renderHook(() => useGameDetail(999));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Game not found');
    expect(result.current.game).toBeNull();
  });
});
