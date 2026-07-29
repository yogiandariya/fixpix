import { useState, useEffect, useCallback } from 'react';

export interface Trend {
  topic: string;
  count: number;
  type: 'global' | 'conflict' | 'tech' | 'economy';
  trend_score: number;
  heat: 'HOT' | 'Rising' | 'Stable';
}

export function useTrends() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTrends = useCallback(async () => {
    try {
      const response = await fetch('/api/news/trending/');
      const data = await response.json();
      if (Array.isArray(data)) {
        setTrends(data);
      }
    } catch (error) {
      console.error('Failed to fetch trends:', error);
    }
  }, []);

  useEffect(() => {
    fetchTrends();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchTrends, 30000);
    return () => clearInterval(interval);
  }, [fetchTrends]);

  return { trends, loading, refresh: fetchTrends };
}
