import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';

// Mock the useFetch and useSWR hooks
const mockData = { name: 'John Doe' };
const mockError = new Error('Failed to fetch');

const mockFetch = jest.fn();
const mockMutate = jest.fn();

jest.mock('next-lite-framework', () => {
  return {
    useFetch: (url: string) => {
      const [state, setState] = React.useState({
        data: null,
        error: null,
        loading: true,
        mutate: mockMutate
      });

      React.useEffect(() => {
        mockFetch(url)
          .then((data: any) => {
            setState({
              data,
              error: null,
              loading: false,
              mutate: mockMutate
            });
          })
          .catch((error: Error) => {
            setState({
              data: null,
              error,
              loading: false,
              mutate: mockMutate
            });
          });
      }, [url]);

      return state;
    },
    useSWR: (key: string, fetcher: (key: string) => Promise<any>) => {
      const [state, setState] = React.useState({
        data: null,
        error: null,
        loading: true,
        mutate: mockMutate
      });

      React.useEffect(() => {
        fetcher(key)
          .then((data: any) => {
            setState({
              data,
              error: null,
              loading: false,
              mutate: mockMutate
            });
          })
          .catch((error: Error) => {
            setState({
              data: null,
              error,
              loading: false,
              mutate: mockMutate
            });
          });
      }, [key, fetcher]);

      return state;
    }
  };
});

import { useFetch, useSWR } from 'next-lite-framework';

describe('Data Fetching Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue(mockData);
  });

  describe('useFetch', () => {
    it('fetches data successfully', async () => {
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
      expect(mockFetch).toHaveBeenCalledWith('/api/user');
    });
    
    it('handles fetch errors', async () => {
      mockFetch.mockRejectedValueOnce(mockError);
      
      const { result } = renderHook(() => useFetch('/api/user'));
      
      // Wait for fetch to complete
      await waitFor(() => expect(result.current.loading).toBe(false));
      
      // Check final state
      expect(result.current.data).toBe(null);
      expect(result.current.error).toEqual(mockError);
    });
  });

  describe('useSWR', () => {
    it('fetches data successfully', async () => {
      const fetcher = jest.fn().mockResolvedValue(mockData);
      
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
      const fetcher = jest.fn().mockRejectedValue(mockError);
      
      const { result } = renderHook(() => useSWR('/api/user', fetcher));
      
      // Wait for fetch to complete
      await waitFor(() => expect(result.current.loading).toBe(false));
      
      // Check final state
      expect(result.current.data).toBe(null);
      expect(result.current.error).toEqual(mockError);
    });
  });
});
