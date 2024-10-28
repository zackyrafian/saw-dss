// components/Criteria/CriteriaSection.tsx
'use client'

import { Criteria } from '@/types/project';

interface CriteriaSectionProps {
  projectId: number;
  criterias?: Criteria[];
  onAddClick: () => void;
  onEditClick: (criteria: Criteria) => void;
  onDeleteClick: (criteria: Criteria) => void;
}

export function CriteriaSection({
  projectId,
  criterias = [],
  onAddClick,
  onEditClick,
  onDeleteClick,
}: CriteriaSectionProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Criteria</h2>
          <button
            onClick={onAddClick}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Add Criteria
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {criterias.length === 0 ? (
          <div className="px-6 py-4 text-gray-500 text-center">
            No criteria added yet
          </div>
        ) : (
          criterias.map((criteria) => (
            <div key={criteria.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{criteria.name}</h3>
                  <p className="text-sm text-gray-500">
                    Weight: {criteria.weight} • Type: {criteria.type}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => onEditClick(criteria)}
                    className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                      />
                    </svg>
                    <span className="sr-only">Edit</span>
                  </button>
                  <button 
                    onClick={() => onDeleteClick(criteria)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                      />
                    </svg>
                    <span className="sr-only">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}