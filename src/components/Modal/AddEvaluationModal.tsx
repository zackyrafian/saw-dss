// components/Modal/AddEvaluationModal.tsx
'use client'

import { useState } from 'react';
import { Criteria, Alternative } from '@/types/project';

interface AddEvaluationModalProps {
  projectId: number;
  criterias: Criteria[];
  alternatives: Alternative[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddEvaluationModal({
  projectId,
  criterias,
  alternatives,
  isOpen,
  onClose,
  onSuccess
}: AddEvaluationModalProps) {
  const [selectedCriteria, setSelectedCriteria] = useState<number>(0);
  const [selectedAlternative, setSelectedAlternative] = useState<number>(0);
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/project/${projectId}/evaluation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          evaluations: [{
            criteriaId: selectedCriteria,
            alternativeId: selectedAlternative,
            value: parseFloat(value)
          }]
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create evaluation');
      }

      setValue('');
      setSelectedCriteria(0);
      setSelectedAlternative(0);
      onClose();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
          onClick={e => e.stopPropagation()}
        >
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Add New Evaluation
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Criteria Selection */}
            <div>
              <label htmlFor="criteria" className="block text-sm font-medium text-gray-700">
                Criteria
              </label>
              <select
                id="criteria"
                value={selectedCriteria}
                onChange={(e) => setSelectedCriteria(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              >
                <option value={0}>Select Criteria</option>
                {criterias.map((criteria) => (
                  <option key={criteria.id} value={criteria.id}>
                    {criteria.name} ({criteria.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Alternative Selection */}
            <div>
              <label htmlFor="alternative" className="block text-sm font-medium text-gray-700">
                Alternative
              </label>
              <select
                id="alternative"
                value={selectedAlternative}
                onChange={(e) => setSelectedAlternative(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              >
                <option value={0}>Select Alternative</option>
                {alternatives.map((alternative) => (
                  <option key={alternative.id} value={alternative.id}>
                    {alternative.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Value Input */}
            <div>
              <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                Value
              </label>
              <input
                type="number"
                id="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                min="0"
                max="10"
                step="0.1"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Enter a value between 0 and 10</p>
            </div>

            {error && (
              <div className="text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !selectedCriteria || !selectedAlternative}
                className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Evaluation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}