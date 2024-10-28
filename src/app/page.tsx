'use client'

import { useState } from 'react'
import ProjectList from "@/components/ProjectList"
import { CreateProjectModal } from "@/components/Modal/CreateProjectModal"

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projectListKey, setProjectListKey] = useState(0)

  const handleProjectCreated = () => {
    // Force ProjectList to refetch by changing its key
    setProjectListKey(prev => prev + 1)
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          New Project
        </button>
      </div>
      
      <ProjectList key={projectListKey} />
      
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  )
}