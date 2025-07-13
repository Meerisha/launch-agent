"use client"

import React, { useState } from 'react'
import ShareButtons from './components/ShareButtons'
import ChatInterface from './components/ChatInterface'
import SampleProjectSelector from './components/SampleProjectSelector'
import { MessageCircle, FileText, ArrowRight } from 'lucide-react'

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
      riskTolerance: 'medium',
      launchWindow: 'Q2 2024',
      creatorSkills: 'Full-stack development, Digital marketing, Team leadership',
      existingAssets: 'Brand identity, Initial MVP, Landing page',
      constraints: 'Limited initial budget, Remote team only'
    })
    setShowSampleProjects(false)
    // Set some sample results to show immediate value
    setResults({
      projectName: projectData.projectName,
      analysis: projectData.analysis,
      recommendations: [
        'Focus on customer acquisition through content marketing',
        'Implement freemium model to reduce friction',
        'Build strong onboarding experience',
        'Develop strategic partnerships'
      ],
      timeline: [
        { phase: 'MVP Launch', duration: '30 days', status: 'ready' },
        { phase: 'Market Testing', duration: '45 days', status: 'pending' },
        { phase: 'Scale & Growth', duration: '90 days', status: 'pending' }
      ]
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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
        throw new Error('Failed to analyze project')
      }

      const data = await response.json()
      setResults(data)
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChatAnalysis = (analysis: any) => {
    setResults(analysis)
    setError('')
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
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
              <a 
                href="/dashboard" 
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg hover:from-blue-700 hover:to-violet-700 transition-all font-medium flex items-center gap-2"
              >
                📊 Metrics Dashboard
              </a>
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
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative">
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              NEW!
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Real-time Market Intelligence</h3>
            <p className="text-sm text-slate-600">Live market data, competitor analysis, and trend insights powered by AI</p>
          </div>
            
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Market Analysis</h3>
            <p className="text-sm text-slate-600">AI-powered viability assessment and competitive landscape analysis</p>
          </div>
            
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">💰</span>
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
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative">
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              LIVE!
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Metrics Dashboard</h3>
            <p className="text-sm text-slate-600">Real-time visualization and scenario modeling with interactive controls</p>
          </div>
        </div>
        </div>
      </section>

      {/* Sample Projects Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-blue-50 to-violet-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">🚀 Get Started Instantly</h2>
            <p className="text-lg text-slate-800 mb-8">Explore sample projects to see LaunchPilot in action</p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div 
                onClick={() => handleSampleProjectSelect({
                  projectName: 'SmartCRM Pro',
                  companyName: 'TechFlow Solutions',
                  targetAudience: 'Small to medium businesses (10-100 employees)',
                  elevatorPitch: 'SmartCRM Pro uses AI to automatically prioritize leads, predict customer churn, and suggest optimal follow-up actions, helping SMBs increase sales by 35%.',
                  launchGoal: '$50,000 MRR within 120 days with 200 paying customers',
                  analysis: {
                    revenueProjections: {
                      summary: { totalRevenue: 600000, monthlyAverage: 50000, requiredLeads: 2000 },
                      scenarioAnalysis: {
                        conservative: { revenue: 400000, customers: 140 },
                        realistic: { revenue: 600000, customers: 200 },
                        optimistic: { revenue: 900000, customers: 300 }
                      }
                    }
                  }
                })}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">💻</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">AI-Powered CRM SaaS</h3>
                <p className="text-sm text-slate-600 mb-4">B2B SaaS platform for small business CRM with AI features</p>
                <div className="text-center">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">$50K MRR Goal</span>
                </div>
              </div>
              
              <div 
                onClick={() => handleSampleProjectSelect({
                  projectName: 'Zero-to-Launch Bootcamp',
                  companyName: 'Launch Academy',
                  targetAudience: 'Aspiring entrepreneurs aged 25-45 with an idea but no launch experience',
                  elevatorPitch: 'A comprehensive 8-week bootcamp that takes complete beginners from idea to first sale, with proven frameworks and live coaching.',
                  launchGoal: '$100,000 revenue in first 90 days with 200 students',
                  analysis: {
                    revenueProjections: {
                      summary: { totalRevenue: 150000, monthlyAverage: 50000, requiredLeads: 5000 },
                      scenarioAnalysis: {
                        conservative: { revenue: 100000, students: 150 },
                        realistic: { revenue: 150000, students: 200 },
                        optimistic: { revenue: 250000, students: 300 }
                      }
                    }
                  }
                })}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Online Course Launch</h3>
                <p className="text-sm text-slate-600 mb-4">Zero-to-Launch Bootcamp for aspiring entrepreneurs</p>
                <div className="text-center">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">$100K Revenue Goal</span>
                </div>
              </div>
              
              <div 
                onClick={() => handleSampleProjectSelect({
                  projectName: 'Growth Scale Consulting',
                  companyName: 'Digital Growth Partners',
                  targetAudience: 'E-commerce brands doing $100K-$1M annual revenue seeking to scale marketing',
                  elevatorPitch: 'We help e-commerce brands scale from $100K to $1M+ through data-driven marketing strategies and retention optimization.',
                  launchGoal: '$25,000 MRR within 60 days with 5 high-value clients',
                  analysis: {
                    revenueProjections: {
                      summary: { totalRevenue: 300000, monthlyAverage: 25000, requiredLeads: 500 },
                      scenarioAnalysis: {
                        conservative: { revenue: 180000, clients: 3 },
                        realistic: { revenue: 300000, clients: 5 },
                        optimistic: { revenue: 480000, clients: 8 }
                      }
                    }
                  }
                })}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Digital Marketing Consulting</h3>
                <p className="text-sm text-slate-600 mb-4">Specialized consulting for e-commerce brands</p>
                <div className="text-center">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">$25K MRR Goal</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowSampleProjects(true)}
              className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-violet-700 transition-all transform hover:-translate-y-0.5 shadow-lg"
            >
              Browse All Sample Projects
            </button>
          </div>
        </div>
      </section>

      {/* Interface Toggle */}
      <section className="py-8 px-4 bg-slate-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Approach</h2>
            <p className="text-lg text-slate-600 mb-8">Get your personalized launch strategy through guided form or interactive chat</p>
            
            <div className="bg-white rounded-xl shadow-lg p-2 inline-flex border border-slate-200">
              <button
                onClick={() => setInterfaceMode('form')}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  interfaceMode === 'form' 
                    ? 'bg-blue-700 text-white shadow-md' 
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <FileText className="w-5 h-5" />
                Form Mode
              </button>
              <button
                onClick={() => setInterfaceMode('chat')}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  interfaceMode === 'chat' 
                    ? 'bg-blue-700 text-white shadow-md' 
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                Chat Mode
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className={`py-16 px-4 bg-white ${interfaceMode === 'form' ? 'block' : 'hidden'}`}>
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Project Analysis Form</h2>
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
                disabled={isLoading}
                className={`${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 transform hover:-translate-y-0.5'
                } text-white font-semibold py-4 px-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  'Generate Launch Strategy'
                )}
              </button>
              <p className="text-sm text-slate-500 mt-4">
                Your strategy will be generated using AI-powered analysis tools with <span className="font-semibold text-emerald-600">real-time market intelligence</span>
              </p>
              
              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* Chat Interface Section */}
      <section className={`py-16 px-4 bg-white ${interfaceMode === 'chat' ? 'block' : 'hidden'}`}>
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Interactive AI Assistant</h2>
            <p className="text-lg text-slate-600">Chat with LaunchPilot AI to get personalized guidance and analysis</p>
          </div>

          <ChatInterface onAnalysisGenerated={handleChatAnalysis} />
        </div>
      </section>

      {/* Results Section */}
      {results && (
        <section id="results" className="py-16 px-4 bg-slate-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Your Launch Strategy for {results.projectName}
              </h2>
              <p className="text-lg text-slate-600">
                Generated on {new Date(results.generatedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
              {/* Market Research - NEW! */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Market Intelligence</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Market Size</h4>
                    <p className="text-sm text-slate-600">{results.analysis.marketResearch?.marketResearch?.marketSize || 'Analyzing...'}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Key Trends</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {(results.analysis.marketResearch?.trendAnalysis?.growingTrends || ['No trends available']).slice(0, 3).map((trend: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          <span>{trend}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Competitors</h4>
                    <p className="text-sm text-slate-600">{results.analysis.marketResearch?.competitorAnalysis?.directCompetitors?.[0] || 'No competitors found'}</p>
                  </div>
                </div>
              </div>

              {/* Project Analysis */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Project Analysis</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Market Viability</h4>
                    <p className="text-sm text-slate-600 mb-2">
                      Score: <span className="font-medium">{results.analysis.projectAnalysis.analysis.marketViability.score}</span>
                    </p>
                    <p className="text-sm text-slate-600">{results.analysis.projectAnalysis.analysis.marketViability.reasoning}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Recommended Approach</h4>
                    <p className="text-sm text-slate-600">{results.analysis.projectAnalysis.analysis.recommendedApproach}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Next Steps</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {results.analysis.projectAnalysis.nextSteps.map((step: any, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="font-medium text-blue-600 mr-2">{step.priority}.</span>
                          <div>
                            <span className="font-medium">{step.action}</span>
                            <span className="text-slate-500 ml-2">({step.timeline})</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Revenue Projections */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Revenue Projections</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Revenue Summary</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          ${results.analysis.revenueProjections.summary.totalRevenue.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-600">Total Revenue</div>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          ${results.analysis.revenueProjections.summary.monthlyAverage.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-600">Monthly Average</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Break-even Analysis</h4>
                    <p className="text-sm text-slate-600">
                      Break-even: <span className="font-medium">{results.analysis.revenueProjections.breakEvenAnalysis.breakEvenUnits} units</span>
                    </p>
                    <p className="text-sm text-slate-600">
                      Time to break-even: <span className="font-medium">{results.analysis.revenueProjections.breakEvenAnalysis.timeToBreakEven} months</span>
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Scenario Analysis</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Conservative:</span>
                        <span className="font-medium">${results.analysis.revenueProjections.scenarioAnalysis.conservative.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Realistic:</span>
                        <span className="font-medium">${results.analysis.revenueProjections.scenarioAnalysis.realistic.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Optimistic:</span>
                        <span className="font-medium">${results.analysis.revenueProjections.scenarioAnalysis.optimistic.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Launch Strategy */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-2xl">🗺️</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Launch Strategy</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Timeline</h4>
                    <div className="space-y-2">
                      {results.analysis.launchStrategy.timeline.phases.map((phase: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">{phase.phase}:</span>
                          <span className="font-medium">{phase.duration} weeks</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Budget Allocation</h4>
                    <div className="space-y-2">
                      {Object.entries(results.analysis.launchStrategy.budgetAllocation.breakdown).map(([category, amount]: [string, any]) => (
                        <div key={category} className="flex justify-between items-center">
                          <span className="text-sm text-slate-600 capitalize">{category}:</span>
                          <span className="font-medium">${amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Key Tactics</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {results.analysis.launchStrategy.strategy.tactics.slice(0, 3).map((tactic: any, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          <span>{tactic.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Share and Export Section */}
            <div className="mt-12 bg-white rounded-xl p-8 shadow-lg">
              <ShareButtons 
                projectName={results.projectName}
                companyName={results.companyName}
                analysis={results.analysis}
                onReportGenerated={(reportData) => {
                  console.log('Report generated:', reportData);
                  // Could show a success notification here
                }}
              />
            </div>

            {/* Additional Actions */}
            <div className="text-center mt-8">
              <button
                onClick={() => window.print()}
                className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 mr-4"
              >
                Print Report
              </button>
              <button
                onClick={() => {
                  setResults(null)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Analyze Another Project
              </button>
            </div>
          </div>
        </section>
      )}

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

      {/* Sample Project Selector Modal */}
      {showSampleProjects && (
        <SampleProjectSelector
          onClose={() => setShowSampleProjects(false)}
          onProjectSelect={handleSampleProjectSelect}
        />
      )}
    </div>
  )
} 