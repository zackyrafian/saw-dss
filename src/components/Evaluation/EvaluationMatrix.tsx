// components/Evaluation/EvaluationMatrix.tsx
'use client'

import { useState, useEffect } from 'react';
import { Criteria, Alternative } from '@/types/project';

interface EvaluationMatrixProps {
    projectId: number;
    criterias: Criteria[];
    alternatives: Alternative[];
    initialValues?: Record<string, number>; // To store existing values
}

export function EvaluationMatrix({
    projectId,
    criterias,
    alternatives,
    initialValues = {}
}: EvaluationMatrixProps) {
    // Matrix state to store values
    const [matrix, setMatrix] = useState<Record<string, number>>(initialValues);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch existing evaluations when component mounts
    useEffect(() => {
        const fetchEvaluations = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/project/${projectId}/evaluation`);
                if (!response.ok) {
                    throw new Error('Failed to fetch evaluations');
                }
                const evaluations = await response.json();

                const matrixValues: Record<string, number> = {};
                evaluations.forEach((evaluation: any) => {
                    matrixValues[`${evaluation.criteriaId}-${evaluation.alternativeId}`] = evaluation.value;
                });

                setMatrix(matrixValues);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchEvaluations();
    }, [projectId]);

    const handleValueChange = (criteriaId: number, alternativeId: number, value: string) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return;

        setMatrix(prev => ({
            ...prev,
            [`${criteriaId}-${alternativeId}`]: numValue
        }));
    };

    // Save all evaluations
    const handleSave = async () => {
        try {
            setLoading(true);
            setError(null);

            // Convert matrix object to evaluations array
            const evaluations = Object.entries(matrix).map(([key, value]) => {
                const [criteriaId, alternativeId] = key.split('-').map(Number);
                return {
                    criteriaId,
                    alternativeId,
                    value
                };
            });

            const response = await fetch(`/api/project/${projectId}/evaluation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ evaluations }),
            });

            if (!response.ok) {
                throw new Error('Failed to save evaluations');
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-pulse text-gray-500">Loading evaluations...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-md">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <div className="flex justify-end p-4">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Alternative / Criteria
                        </th>
                        {criterias.map(criteria => (
                            <th
                                key={criteria.id}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                <div>{criteria.name}</div>
                                <div className="text-gray-400 font-normal">
                                    {criteria.type} ({criteria.weight * 100}%)
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {alternatives.map(alternative => (
                        <tr key={alternative.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {alternative.name}
                            </td>
                            {criterias.map(criteria => (
                                <td key={criteria.id} className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="number"
                                        value={matrix[`${criteria.id}-${alternative.id}`] || ''}
                                        onChange={(e) => handleValueChange(criteria.id, alternative.id, e.target.value)}
                                        className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        min="0"
                                        max="10"
                                        step="0.1"
                                        placeholder="0-10"
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>

                {/* Optional: Add summary row for averages or totals */}
                <tfoot className="bg-gray-50">
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Max
                        </td>
                        {criterias.map(criteria => {
                            const values = alternatives.map(alt => matrix[`${criteria.id}-${alt.id}`] || 0);

                            // Jika tidak ada nilai, return 0
                            if (!values.length) return 0;

                            // Tentukan nilai max berdasarkan tipe kriteria
                            let maxValue;
                            if (criteria.type.toLowerCase() === 'benefit') {
                                // Untuk BENEFIT, ambil nilai tertinggi
                                maxValue = Math.max(...values);
                            } else if (criteria.type.toLowerCase() === 'cost') {
                                // Untuk COST, ambil nilai terendah
                                maxValue = Math.min(...values);
                            } else {
                                // Jika tipe tidak dikenali, gunakan rata-rata sebagai fallback
                                maxValue = values.reduce((a, b) => a + b, 0) / values.length;
                            }

                            return (
                                <td key={criteria.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {maxValue.toFixed(2)}
                                </td>
                            );
                        })}
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}