import { useState, useEffect, useCallback } from 'react';
import api from '@/api';
import { FitnessVenue, SearchFitnessVenuesParams, InfiniteScrollResponse } from '@/api/services/fitness-venues.service';

export const useFitnessVenues = () => {
  const [venues, setVenues] = useState<FitnessVenue[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);

  const fetchVenues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.fitnessVenuesService.getAllVenues();
      setVenues(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch venues');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchVenues = useCallback(async (params: SearchFitnessVenuesParams, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setVenues([]); // Clear existing venues for new search
      }
      setError(null);
      
      const response = await api.fitnessVenuesService.searchVenues(params);
      
      if (append) {
        setVenues(prev => [...prev, ...response.data]);
      } else {
        setVenues(response.data);
      }
      
      setHasMore(response.hasMore);
      setNextCursor(response.nextCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search venues');
    } finally {
      if (append) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  const loadMore = useCallback(async (params: SearchFitnessVenuesParams) => {
    if (!hasMore || loadingMore) return;
    
    await searchVenues({
      ...params,
      cursor: nextCursor,
    }, true);
  }, [hasMore, loadingMore, nextCursor, searchVenues]);

  return {
    venues,
    loading,
    loadingMore,
    error,
    hasMore,
    fetchVenues,
    searchVenues,
    loadMore,
  };
};
