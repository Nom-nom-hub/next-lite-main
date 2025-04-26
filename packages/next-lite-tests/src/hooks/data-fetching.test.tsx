import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFetch, useSWR } from 'next-lite-framework';

// Mock fetch
global.fetch = jest.fn();

describe('Data Fetching Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('useFetch', () => {
    it('fetches data successfully', async () => {
      const mockData = { name: 'John Doe' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });
      
      const { result } = renderHook(() => useFetch('/api/user'));
      
      // Initial state
      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(null);
      
      // Wait for fetch to complete
      await waitFor(() => expect(result.current.loading).toBe(false));
      
      // Check final state
      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBe(null);
      expect(global.fetch).toHaveBeenCalledWith('/api/user', expect.any(Object));
    });
    
    it('handles fetch errors', async () => {
      const mockError = new Error('Failed to fetch');
      (global.fetch as jest.Mock).mockRejectedValueOnce(mockError);
      
      const { result } = renderHook(() => useFetch('/api/user'));
      
      // Wait for fetch to complete
      await waitFor(() => expect(result.current.loading).toBe(false));
      
      // Check final state
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Failed to fetch');
    });
    
    it('handles HTTP errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404
      });
      
      const { result } = renderHook(() => useFetch('/api/user'));
      
      // Wait for fetch to complete
      await waitFor(() => expect(result.current.loading).toBe(false));
      
      // Check final state
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toContain('HTTP error');
    });
    
    it('supports custom fetch options', async () => {
      const mockData = { name: 'John Doe' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });
      
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { id: 1 }
      };
      
      renderHook(() => useFetch('/api/user', options));
      
      expect(global.fetch).toHaveBeenCalledWith('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 1 })
      });
    });
    
    it('supports mutate function', async () => {
      const mockData = { name: 'John Doe' };
      const updatedData = { name: 'Jane Doe' };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });
      
      const { result } = renderHook(() => useFetch('/api/user'));
      
      // Wait for initial fetch to complete
      await waitFor(() => expect(result.current.loading).toBe(false));
      
      // Update data with mutate
      act(() => {
        result.current.mutate(updatedData);
      });
      
      // Check updated state
      expect(result.current.data).toEqual(updatedData);
      expect(result.current.loading).toBe(false);
      
      // Mutate without data should trigger a refetch
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });
      
      act(() => {
        result.current.mutate();
      });
      
      // Should be loading again
      expect(result.current.loading).toBe(true);
      
      // Wait for refetch to complete
      await waitFor(() => expect(result.current.loading).toBe(false));
      
      // Check final state
      expect(result.current.data).toEqual(mockData);
    });
  });
  
  describe('useSWR', () => {
    it('fetches data successfully', async () => {
      const mockData = { name: 'John Doe' };
      const fetcher = jest.fn().mockResolvedValueOnce(mockData);
      
      const { result } = renderHook(() => useSWR('/api/user', fetcher));
      
      // Initial state
      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(null);
      
      // Wait for fetch to complete
      await waitFor(() => expect(result.current.loading).toBe(false));
      
      // Check final state
      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBe(null);
      expect(fetcher).toHaveBeenCalledWith('/api/user');
    });
    
    it('handles fetch errors', async () => {
      const mockError = new Error('Failed to fetch');
      const fetcher = jest.fn().mockRejectedValueOnce(mockError);
      
      const { result } = renderHook(() => useSWR('/api/user', fetcher));
      
      // Wait for fetch to complete
      await waitFor(() => expect(result.current.loading).toBe(false));
      
      // Check final state
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Failed to fetch');
    });
    
    it('caches data between hook calls', async () => {
      const mockData = { name: 'John Doe' };
      const fetcher = jest.fn().mockResolvedValueOnce(mockData);
      
      // First render
      const { result, rerender } = renderHook(() => useSWR('/api/user', fetcher));
      
      // Wait for fetch to complete
      await waitFor(() => expect(result.current.loading).toBe(false));
      
      // Check that data is cached
      expect(result.current.data).toEqual(mockData);
      expect(fetcher).toHaveBeenCalledTimes(1);
      
      // Rerender with same key
      rerender();
      
      // Should use cached data
      expect(result.current.data).toEqual(mockData);
      expect(result.current.loading).toBe(false);
      expect(fetcher).toHaveBeenCalledTimes(1);
    });
    
    it('supports mutate function', async () => {
      const mockData = { name: 'John Doe' };
      const updatedData = { name: 'Jane Doe' };
      const fetcher = jest.fn().mockResolvedValueOnce(mockData);
      
      const { result } = renderHook(() => useSWR('/api/user', fetcher));
      
      // Wait for initial fetch to complete
      await waitFor(() => expect(result.current.loading).toBe(false));
      
      // Update data with mutate
      act(() => {
        result.current.mutate(updatedData);
      });
      
      // Check updated state
      expect(result.current.data).toEqual(updatedData);
      expect(result.current.loading).toBe(false);
      
      // Mutate without data should trigger a refetch
      fetcher.mockResolvedValueOnce(mockData);
      
      act(() => {
        result.current.mutate();
      });
      
      // Should be loading again
      expect(result.current.loading).toBe(true);
      
      // Wait for refetch to complete
      await waitFor(() => expect(result.current.loading).toBe(false));
      
      // Check final state
      expect(result.current.data).toEqual(mockData);
      expect(fetcher).toHaveBeenCalledTimes(2);
    });
  });
});
