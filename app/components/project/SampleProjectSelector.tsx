'use client';

import React, { useState } from 'react';
import { sampleProjects, categories, difficulties, SampleProject } from '@/lib/sample-projects';

interface SampleProjectSelectorProps {
  onProjectSelect: (projectData: any) => void;
  onClose: () => void;
}

export default function SampleProjectSelector({ onProjectSelect, onClose }: SampleProjectSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<SampleProject | null>(null);

  const filteredProjects = sampleProjects.filter(project => {
    const categoryMatch = selectedCategory === 'all' || project.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || project.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const handleProjectSelect = (project: SampleProject) => {
    setSelectedProject(project);
  };

  const handleUseProject = () => {
    if (selectedProject) {
      onProjectSelect(selectedProject.data);
      onClose();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-6xl max-h-[90vh] overflow-hidden flex">
        {/* Left Panel - Project List */}
        <div className="w-1/2 p-6 border-r border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Sample Projects</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Difficulties</option>
                {difficulties.map(diff => (
                  <option key={diff.id} value={diff.id}>
                    {diff.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Project List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                onClick={() => handleProjectSelect(project)}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-blue-500 ${
                  selectedProject?.id === project.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(project.difficulty)}`}>
                    {project.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {categories.find(c => c.id === project.category)?.icon} {project.category}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {project.industry}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Project Details */}
        <div className="w-1/2 p-6">
          {selectedProject ? (
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedProject.name}</h3>
                  <p className="text-gray-600 mb-4">{selectedProject.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Industry:</span>
                      <p className="text-gray-900">{selectedProject.industry}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Category:</span>
                      <p className="text-gray-900">
                        {categories.find(c => c.id === selectedProject.category)?.icon} {' '}
                        {categories.find(c => c.id === selectedProject.category)?.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Project Overview</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Company:</p>
                      <p className="text-gray-900 mb-2">{selectedProject.data.companyName}</p>
                      
                      <p className="text-sm font-medium text-gray-700 mb-1">Target Audience:</p>
                      <p className="text-gray-900 mb-2">{selectedProject.data.targetAudience}</p>
                      
                      <p className="text-sm font-medium text-gray-700 mb-1">Launch Goal:</p>
                      <p className="text-gray-900">{selectedProject.data.launchGoal}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Elevator Pitch</h4>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-gray-900 text-sm">{selectedProject.data.elevatorPitch}</p>
                    </div>
                  </div>

                  {selectedProject.data.analysis?.revenueProjections && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Revenue Projections</h4>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">Total Revenue:</span>
                            <p className="font-semibold text-green-800">
                              ${selectedProject.data.analysis.revenueProjections.summary.totalRevenue?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Monthly Average:</span>
                            <p className="font-semibold text-green-800">
                              ${selectedProject.data.analysis.revenueProjections.summary.monthlyAverage?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedProject.data.analysis?.competitiveIntelligence && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Market Insights</h4>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="space-y-2">
                          {selectedProject.data.analysis.competitiveIntelligence.marketTrends?.slice(0, 2).map((trend: any, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                              <span className="text-purple-600 text-xs">•</span>
                              <span className="text-sm text-gray-900">{trend.trend}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleUseProject}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-violet-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-violet-700 transition-all"
                >
                  Use This Project
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <p>Select a project to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 