"use client"

import React, { useState } from 'react'

export default function LaunchPilotHomePage() {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // TODO: Connect to MCP tools
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🚀</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">LaunchPilot</h1>
                <p className="text-sm text-slate-600">AI Launch Consultant</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <span className="text-sm text-slate-600">Powered by MCP</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Transform Your Idea Into a 
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent"> Revenue Engine</span>
          </h1>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Get AI-powered analysis, financial projections, and a complete go-to-market strategy 
            tailored to your unique project and goals.
          </p>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Market Analysis</h3>
              <p className="text-sm text-slate-600">Comprehensive viability assessment and competitive landscape analysis</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Revenue Forecasting</h3>
              <p className="text-sm text-slate-600">Detailed financial projections with break-even analysis and scenario planning</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🗺️</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Launch Strategy</h3>
              <p className="text-sm text-slate-600">Custom go-to-market roadmap with timeline and budget allocation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Get Your Launch Strategy</h2>
            <p className="text-lg text-slate-600">Fill out the form below to receive your personalized analysis</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Project Name */}
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-slate-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g., Zero-to-Launch Bootcamp"
                  required
                />
              </div>

              {/* Target Audience */}
              <div>
                <label htmlFor="targetAudience" className="block text-sm font-medium text-slate-700 mb-2">
                  Target Audience *
                </label>
                <input
                  type="text"
                  id="targetAudience"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g., Solo entrepreneurs, 25-45"
                  required
                />
              </div>
            </div>

            {/* Elevator Pitch */}
            <div>
              <label htmlFor="elevatorPitch" className="block text-sm font-medium text-slate-700 mb-2">
                Elevator Pitch *
              </label>
              <textarea
                id="elevatorPitch"
                name="elevatorPitch"
                value={formData.elevatorPitch}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Describe your project in 2-3 sentences. What problem does it solve and for whom?"
                required
              ></textarea>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Launch Goal */}
              <div>
                <label htmlFor="launchGoal" className="block text-sm font-medium text-slate-700 mb-2">
                  Launch Goal (SMART) *
                </label>
                <input
                  type="text"
                  id="launchGoal"
                  name="launchGoal"
                  value={formData.launchGoal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g., $25k revenue in 60 days"
                  required
                />
              </div>

              {/* Risk Tolerance */}
              <div>
                <label htmlFor="riskTolerance" className="block text-sm font-medium text-slate-700 mb-2">
                  Risk Tolerance *
                </label>
                <select
                  id="riskTolerance"
                  name="riskTolerance"
                  value={formData.riskTolerance}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                >
                  <option value="">Select...</option>
                  <option value="low">Low - Conservative approach</option>
                  <option value="medium">Medium - Balanced approach</option>
                  <option value="high">High - Aggressive approach</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Launch Window */}
              <div>
                <label htmlFor="launchWindow" className="block text-sm font-medium text-slate-700 mb-2">
                  Launch Window *
                </label>
                <input
                  type="text"
                  id="launchWindow"
                  name="launchWindow"
                  value={formData.launchWindow}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g., Q1 2024 or ASAP"
                  required
                />
              </div>

              {/* Existing Assets */}
              <div>
                <label htmlFor="existingAssets" className="block text-sm font-medium text-slate-700 mb-2">
                  Existing Assets
                </label>
                <input
                  type="text"
                  id="existingAssets"
                  name="existingAssets"
                  value={formData.existingAssets}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Docs, videos, designs, etc."
                />
              </div>
            </div>

            {/* Skills & Resources */}
            <div>
              <label htmlFor="creatorSkills" className="block text-sm font-medium text-slate-700 mb-2">
                Skills & Resources *
              </label>
              <textarea
                id="creatorSkills"
                name="creatorSkills"
                value={formData.creatorSkills}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Team size, tech stack, budget, social media following, email list size..."
                required
              ></textarea>
            </div>

            {/* Constraints */}
            <div>
              <label htmlFor="constraints" className="block text-sm font-medium text-slate-700 mb-2">
                Key Constraints
              </label>
              <input
                type="text"
                id="constraints"
                name="constraints"
                value={formData.constraints}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="No paid ads, GDPR compliance, limited budget, etc."
              />
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold py-4 px-12 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Generate Launch Strategy
              </button>
              <p className="text-sm text-slate-500 mt-4">
                Your strategy will be generated using our AI-powered analysis tools
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🚀</span>
            </div>
            <span className="text-xl font-bold">LaunchPilot</span>
          </div>
          <p className="text-slate-400 mb-4">
            AI Launch Consultant powered by Model Context Protocol
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
            <span>MCP Endpoint: <code className="bg-slate-800 px-2 py-1 rounded">/mcp</code></span>
            <span>Compatible with Cursor, Claude Desktop, and more</span>
          </div>
        </div>
      </footer>
    </div>
  )
} 