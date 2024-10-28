'use client'

import { Alternative } from '@/types/project';

interface AlternativeSectionProps {
  projectId: number;
  alternatives?: Alternative[];
  onAddClick: () => void;
  onEditClick: (alternative: Alternative) => void;
  onDeleteClick: (alternative: Alternative) => void;
}

export function AlternativeSection({
  projectId,
  alternatives = [],
  onAddClick,
  onEditClick,
  onDeleteClick,
}: AlternativeSectionProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Alternatives</h2>
          <button
            onClick={onAddClick}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Add Alternative
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {alternatives.length === 0 ? (
          <div className="px-6 py-4 text-gray-500 text-center">
            No alternatives added yet
          </div>
        ) : (
          alternatives.map((alternative) => (
            <div key={alternative.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{alternative.name}</h3>
                  {alternative.description && (
                    <p className="text-sm text-gray-500">{alternative.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => onEditClick(alternative)}
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
                    onClick={() => onDeleteClick(alternative)}
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