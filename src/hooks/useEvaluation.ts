import { useState, useCallback } from 'react';
import { EvaluationValue } from '@/types/project';

export function useEvaluation(projectId: number) {
  const [evaluations, setEvaluations] = useState<EvaluationValue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvaluations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/project/${projectId}/evaluation`);
      if (!response.ok) throw new Error('Failed to fetch evaluations');
      const data = await response.json();
      setEvaluations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const saveEvaluations = useCallback(async (evaluations: EvaluationValue[]) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/project/${projectId}/evaluation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ evaluations }),
      });
      if (!response.ok) throw new Error('Failed to save evaluations');
      await fetchEvaluations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [projectId, fetchEvaluations]);

  return {
    evaluations,
    loading,
    error,
    fetchEvaluations,
    saveEvaluations,
  };
}