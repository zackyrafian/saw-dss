// app/projects/[id]/page.tsx
'use client'

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { CriteriaSection } from '@/components/Criteria/CriteriaSection';
import { AlternativeSection } from '@/components/Alternative/AlternativeSection';
import { AddCriteriaModal } from '@/components/Modal/AddCriteriaModal';
import { AddAlternativeModal } from '@/components/Modal/AddAlternativeModal';
import { AddEvaluationModal } from '@/components/Modal/AddEvaluationModal';
import { EvaluationMatrix } from '@/components/Evaluation/EvaluationMatrix';
import { useCriteria } from '@/hooks/useCriteria';
import { useAlternatives } from '@/hooks/useAlternatives';
import { useEvaluation } from '@/hooks/useEvaluation';

// Types
interface Criteria {
  id: number;
  name: string;
  weight: number;
  type: 'COST' | 'BENEFIT';
}

interface Alternative {
  id: number;
  name: string;
  description?: string;
}

interface Evaluation {
  id: number;
  criteriaId: number;
  alternativeId: number;
  value: number;
}

interface ProjectDetail {
  id: number;
  name: string;
  criterias?: Criteria[];
  alternatives?: Alternative[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddCriteriaModalOpen, setIsAddCriteriaModalOpen] = useState(false);
  const [isAddAlternativeModalOpen, setIsAddAlternativeModalOpen] = useState(false);
  const [isAddEvaluationModalOpen, setIsAddEvaluationModalOpen] = useState(false);

  const projectId = parseInt(params.id as string);

  // Criteria hooks
  const {
    criterias,
    loading: criteriasLoading,
    error: criteriasError,
    fetchCriterias,
    deleteCriteria
  } = useCriteria(projectId);

  // Alternative hooks
  const {
    alternatives,
    loading: alternativesLoading,
    error: alternativesError,
    fetchAlternatives,
    deleteAlternative
  } = useAlternatives(projectId);

  // Evaluation hooks
  const {
    evaluations,
    loading: evaluationsLoading,
    error: evaluationsError,
    fetchEvaluations,
    saveEvaluations
  } = useEvaluation(projectId);

  const fetchProject = useCallback(async () => {
    try {
      if (isNaN(projectId)) {
        throw new Error('Invalid project ID');
      }

      const response = await fetch(`/api/project/${projectId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }
      const data = await response.json();
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
    fetchCriterias();
    fetchAlternatives();
    fetchEvaluations();
  }, [fetchProject, fetchCriterias, fetchAlternatives, fetchEvaluations]);

  // Criteria handlers
  const handleEditCriteria = (criteria: Criteria) => {
    // To be implemented
    console.log('Edit criteria:', criteria);
  };

  const handleDeleteCriteria = async (criteria: Criteria) => {
    if (window.confirm('Are you sure you want to delete this criteria?')) {
      await deleteCriteria(criteria.id);
    }
  };

  // Alternative handlers
  const handleEditAlternative = (alternative: Alternative) => {
    // To be implemented
    console.log('Edit alternative:', alternative);
  };

  const handleDeleteAlternative = async (alternative: Alternative) => {
    if (window.confirm('Are you sure you want to delete this alternative?')) {
      await deleteAlternative(alternative.id);
    }
  };

  // Loading state
  if (loading || criteriasLoading || alternativesLoading || evaluationsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  // Error state
  if (error || criteriasError || alternativesError || evaluationsError) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-600">
          {error || criteriasError || alternativesError || evaluationsError}
        </p>
      </div>
    );
  }

  // Not found state
  if (!project) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Project not found</p>
      </div>
    );
  }

  // Calculate SAW
  const handleCalculateSAW = () => {
    // To be implemented
    console.log('Calculate SAW');
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          </div>
        </div>

        {/* Criteria Section */}
        <CriteriaSection
          projectId={projectId}
          criterias={criterias}
          onAddClick={() => setIsAddCriteriaModalOpen(true)}
          onEditClick={handleEditCriteria}
          onDeleteClick={handleDeleteCriteria}
        />

        {/* Alternative Section */}
        <AlternativeSection
          projectId={projectId}
          alternatives={alternatives}
          onAddClick={() => setIsAddAlternativeModalOpen(true)}
          onEditClick={handleEditAlternative}
          onDeleteClick={handleDeleteAlternative}
        />

        {/* Evaluation Section */}
        {criterias.length > 0 && alternatives.length > 0 && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Evaluations</h2>
                <button
                  onClick={() => setIsAddEvaluationModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Add Evaluation
                </button>
              </div>
            </div>
            <EvaluationMatrix
              projectId={projectId}
              criterias={criterias}
              alternatives={alternatives}
            />
          </div>
        )}

        {/* Calculate Button */}
        {criterias.length > 0 && alternatives.length > 0 && evaluations.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={handleCalculateSAW}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              Calculate SAW
            </button>
          </div>
        )}

        {/* Modals */}
        <AddCriteriaModal
          projectId={projectId}
          isOpen={isAddCriteriaModalOpen}
          onClose={() => setIsAddCriteriaModalOpen(false)}
          onSuccess={fetchCriterias}
        />

        <AddAlternativeModal
          projectId={projectId}
          isOpen={isAddAlternativeModalOpen}
          onClose={() => setIsAddAlternativeModalOpen(false)}
          onSuccess={fetchAlternatives}
        />

        <AddEvaluationModal
          projectId={projectId}
          criterias={criterias}
          alternatives={alternatives}
          isOpen={isAddEvaluationModalOpen}
          onClose={() => setIsAddEvaluationModalOpen(false)}
          onSuccess={fetchEvaluations}
        />
      </div>
    </div>
  );
}