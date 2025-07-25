"use client"

import React, { useState } from 'react'
import ShareButtons from './components/ui/ShareButtons'
import ChatInterface from './components/features/ChatInterface'
import SampleProjectSelector from './components/project/SampleProjectSelector'
import AuthButton from './components/auth/AuthButton'
import SaveProjectButton from './components/project/SaveProjectButton'
import Providers from './providers'
import { MessageCircle, FileText, ArrowRight } from 'lucide-react'

function LaunchPilotContent() {
  const [formData, setFormData] = useState({
    projectName: '',
    elevatorPitch: '',
    targetAudience: '',
    launchGoal: '',
    riskTolerance: '',
    launchWindow: '',
    creatorSkills: '',
    existingAssets: '',
    constraints: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [interfaceMode, setInterfaceMode] = useState<'form' | 'chat'>('form')
  const [showSampleProjects, setShowSampleProjects] = useState(false)

  const handleSampleProjectSelect = (projectData: any) => {
    setFormData({
      projectName: projectData.projectName,
      elevatorPitch: projectData.elevatorPitch,
      targetAudience: projectData.targetAudience,
      launchGoal: projectData.launchGoal,
      riskTolerance: projectData.riskTolerance || '',
      launchWindow: projectData.launchWindow || '',
      creatorSkills: projectData.creatorSkills || '',
      existingAssets: projectData.existingAssets || '',
      constraints: projectData.constraints || ''
    })
    setShowSampleProjects(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        setResults(data)
      }
    } catch (error) {
      console.error('Analysis error:', error)
      setError('Failed to analyze project. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">LP</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  LaunchPilot
                </h1>
                <p className="text-sm text-gray-600">AI Launch Consultant</p>
              </div>
            </div>
            
            {/* Auth Button */}
            <AuthButton />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Interface Mode Toggle */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-5xl font-bold gradient-text mb-6">
            Transform Ideas Into Revenue
          </h2>
          <p className="text-xl text-slate-600 mb-10 max-w-4xl mx-auto leading-relaxed">
            AI-powered launch consultant that analyzes your idea, forecasts revenue, and creates your go-to-market strategy with real-time insights
          </p>
          
          <div className="inline-flex bg-white/80 backdrop-blur-sm rounded-2xl p-2 mb-10 shadow-lg border border-white/20">
            <button
              onClick={() => setInterfaceMode('form')}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                interfaceMode === 'form'
                  ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <FileText className="inline-block w-5 h-5 mr-3" />
              Form Mode
            </button>
            <button
              onClick={() => setInterfaceMode('chat')}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                interfaceMode === 'chat'
                  ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <MessageCircle className="inline-block w-5 h-5 mr-3" />
              Chat Mode
            </button>
          </div>
        </div>

        {/* Sample Projects Section */}
        <div className="mb-12 animate-slide-in">
          <div className="card-glass hover-lift gradient-border">
            <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-3 flex items-center">
                    <span className="mr-3">🚀</span>
                    Try Sample Projects
                  </h3>
                  <p className="text-blue-100 text-lg mb-6 max-w-2xl">
                    Explore realistic launch scenarios with pre-loaded data and see LaunchPilot's AI analysis in action
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-4xl">✨</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowSampleProjects(!showSampleProjects)}
                className="group inline-flex items-center px-8 py-4 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 hover:text-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#1e40af',
                  fontWeight: '700',
                  textShadow: 'none',
                  border: '1px solid #e2e8f0'
                }}
              >
                {showSampleProjects ? 'Hide' : 'Explore'} Sample Projects
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {showSampleProjects && (
            <SampleProjectSelector
              onProjectSelect={(projectData) => {
                handleSampleProjectSelect(projectData)
              }}
              onClose={() => setShowSampleProjects(false)}
            />
          )}
        </div>

        {/* Main Interface */}
        {interfaceMode === 'chat' ? (
          <ChatInterface />
        ) : (
          <div className="space-y-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="card hover-lift animate-fade-in">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Launch Your Project</h3>
                <p className="text-gray-600">Tell us about your idea and we'll create a comprehensive launch strategy</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Project Name */}
                <div className="space-y-2">
                  <label htmlFor="projectName" className="block text-sm font-semibold text-gray-900">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    id="projectName"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                    placeholder="My Awesome Project"
                  />
                </div>

                {/* Target Audience */}
                <div>
                  <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience *
                  </label>
                  <input
                    type="text"
                    id="targetAudience"
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Small business owners, freelancers..."
                  />
                </div>
              </div>

              {/* Elevator Pitch */}
              <div className="mt-6">
                <label htmlFor="elevatorPitch" className="block text-sm font-medium text-gray-700 mb-2">
                  Elevator Pitch *
                </label>
                <textarea
                  id="elevatorPitch"
                  name="elevatorPitch"
                  value={formData.elevatorPitch}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your project in 2-3 sentences..."
                />
              </div>

              {/* Launch Goal */}
              <div className="mt-6">
                <label htmlFor="launchGoal" className="block text-sm font-medium text-gray-700 mb-2">
                  Launch Goal *
                </label>
                <input
                  type="text"
                  id="launchGoal"
                  name="launchGoal"
                  value={formData.launchGoal}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="$10k revenue in 60 days, 100 customers..."
                />
              </div>

              {/* Submit Button */}
              <div className="mt-10 pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group w-full btn-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Analyzing Project...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="mr-3">🚀</span>
                      Analyze My Launch
                      <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  )}
                </button>
              </div>
            </form>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Results Display */}
            {results && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Launch Analysis Results</h3>
                <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
                  {JSON.stringify(results, null, 2)}
                </pre>
                
                {/* Share Buttons */}
                <div className="mt-6 pt-6 border-t">
                  <ShareButtons 
                    projectName={formData.projectName || 'Untitled Project'}
                    analysis={results}
                  />
                </div>
              </div>
            )}

            {/* Save Project Button */}
            {(formData.projectName || formData.elevatorPitch) && (
              <div className="border-t pt-6">
                <SaveProjectButton
                  projectData={formData}
                  analysis={results}
                  onSaved={(projectId) => {
                    console.log('Project saved with ID:', projectId)
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function LaunchPilotHomePage() {
  return (
    <Providers>
      <LaunchPilotContent />
    </Providers>
  )
} 