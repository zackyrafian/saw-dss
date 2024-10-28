// hooks/useCriteria.ts
import { useState, useCallback } from 'react';
import { Criteria } from '@/types/project';

export function useCriteria(projectId: number) {
  const [criterias, setCriterias] = useState<Criteria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCriterias = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/project/${projectId}/criteria`);
      if (!response.ok) {
        throw new Error('Failed to fetch criterias');
      }
      const data = await response.json();
      setCriterias(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const deleteCriteria = useCallback(async (criteriaId: number) => {
    try {
      const response = await fetch(`/api/project/${projectId}/criteria/${criteriaId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete criteria');
      }
      await fetchCriterias();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, [projectId, fetchCriterias]);

  return {
    criterias,
    loading,
    error,
    fetchCriterias,
    deleteCriteria,
  };
}