import { useState, useCallback } from 'react';
import { Alternative } from '@/types/project';

export function useAlternatives(projectId: number) {
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlternatives = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/project/${projectId}/alternative`);
      if (!response.ok) {
        throw new Error('Failed to fetch alternatives');
      }
      const data = await response.json();
      setAlternatives(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const deleteAlternative = useCallback(async (alternativeId: number) => {
    try {
      const response = await fetch(`/api/project/${projectId}/alternative/${alternativeId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete alternative');
      }
      await fetchAlternatives();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, [projectId, fetchAlternatives]);

  return {
    alternatives,
    loading,
    error,
    fetchAlternatives,
    deleteAlternative,
  };
}