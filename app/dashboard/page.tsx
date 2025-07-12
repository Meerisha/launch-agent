"use client"

import React, { useState, useEffect } from 'react'
import MetricsDashboard from '../components/MetricsDashboard'
import ReportGenerator from '../components/ReportGenerator'
import { FileText, BarChart3, ArrowLeft, Download, Sparkles } from 'lucide-react'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'metrics' | 'reports'>('metrics')
  const [sampleData, setSampleData] = useState<any>(null)

  // Generate sample data for demonstration
  useEffect(() => {
    const generateSampleData = () => {
      const projectName = "EcoTech Solutions"
      const companyName = "GreenTech Innovations"
      
      // Sample analysis data structure
      const analysis = {
        projectAnalysis: {
          analysis: {
            marketViability: {
              score: 8.5,
              reasoning: "Strong market demand for sustainable technology solutions with growing investor interest and regulatory support."
            },
            recommendedApproach: "Focus on B2B market with enterprise partnerships and gradual consumer market expansion.",
            resourceAssessment: {
              teamStrength: "Strong technical team with renewable energy expertise",
              technicalCapability: "Advanced IoT and AI capabilities for energy optimization",
              contentReadiness: "Well-prepared with patents and technical documentation"
            },
            riskFactors: {
              factors: [
                "Regulatory changes in renewable energy sector",
                "Competition from established energy companies",
                "Technology adoption barriers in traditional industries"
              ]
            }
          },
          nextSteps: [
            {
              priority: "High",
              action: "Secure Series A funding",
              details: "Target $5M funding round for product development and market entry",
              timeline: "3-6 months"
            },
            {
              priority: "Medium",
              action: "Build strategic partnerships",
              details: "Partner with energy companies and IoT platform providers",
              timeline: "4-8 months"
            }
          ]
        },
        revenueProjections: {
          summary: {
            totalRevenue: 2400000,
            monthlyAverage: 200000,
            requiredLeads: 1200
          },
          breakEvenAnalysis: {
            breakEvenUnits: 240,
            timeToBreakEven: 18,
            profitMargin: 35
          },
          scenarioAnalysis: {
            conservative: {
              revenue: 1800000,
              probability: "70%"
            },
            realistic: {
              revenue: 2400000,
              probability: "50%"
            },
            optimistic: {
              revenue: 3200000,
              probability: "20%"
            }
          }
        },
        competitiveIntelligence: {
          marketTrends: [
            {
              trend: "Growing demand for energy efficiency solutions",
              impact: "High",
              timeframe: "2024-2026"
            },
            {
              trend: "Increased IoT adoption in industrial sectors",
              impact: "Medium",
              timeframe: "2024-2025"
            }
          ],
          competitiveLandscape: {
            directCompetitors: [
              {
                name: "EnergyFlow Systems",
                description: "Enterprise energy management platform",
                strength: "Market presence"
              },
              {
                name: "SmartGrid Solutions",
                description: "AI-powered grid optimization",
                strength: "Technology innovation"
              }
            ],
            indirectCompetitors: [
              {
                name: "Traditional Energy Consultants",
                description: "Manual energy auditing services",
                strength: "Established relationships"
              }
            ],
            emergingCompetitors: [
              {
                name: "CleanTech Startups",
                description: "Various sustainable technology solutions",
                strength: "Innovation speed"
              }
            ]
          }
        },
        launchStrategy: {
          timeline: {
            phases: [
              { phase: "Product Development", duration: 12 },
              { phase: "Beta Testing", duration: 8 },
              { phase: "Market Launch", duration: 6 },
              { phase: "Scale Up", duration: 16 }
            ]
          },
          budgetAllocation: {
            breakdown: {
              development: 150000,
              marketing: 80000,
              operations: 50000,
              sales: 70000
            }
          },
          strategy: {
            tactics: [
              {
                description: "Partner with energy consulting firms for market entry"
              },
              {
                description: "Develop thought leadership content on energy efficiency"
              },
              {
                description: "Attend major energy and sustainability conferences"
              }
            ]
          }
        }
      }

      setSampleData({
        projectName,
        companyName,
        analysis,
        generatedAt: new Date().toISOString()
      })
    }

    generateSampleData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <a 
                href="/" 
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </a>
              <div className="w-2 h-8 bg-slate-300 rounded-full"></div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">📊</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                  <p className="text-sm text-slate-600">Analytics & Report Generation</p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <span className="text-sm text-slate-600">Powered by LaunchPilot AI</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-white rounded-xl shadow-lg p-2 inline-flex border border-slate-200 mb-8">
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === 'metrics' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Metrics & Analytics
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === 'reports' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-5 h-5" />
              Report Generation
            </button>
          </div>

          {/* Content */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-full">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Real-time Business Metrics</h2>
                    <p className="text-gray-600">Interactive visualization and scenario modeling</p>
                  </div>
                </div>
              </div>
              <MetricsDashboard />
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-full">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Professional Report Generation</h2>
                    <p className="text-gray-600">Create custom, branded reports with AI-powered insights</p>
                  </div>
                </div>
              </div>
              
              {sampleData && (
                <ReportGenerator
                  projectName={sampleData.projectName}
                  companyName={sampleData.companyName}
                  analysis={sampleData.analysis}
                  onReportGenerated={(reportData) => {
                    console.log('Report generated:', reportData);
                    // Show success notification
                  }}
                />
              )}
              
              {!sampleData && (
                <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analysis Data Available</h3>
                  <p className="text-gray-600 mb-4">
                    Complete a project analysis on the home page to generate reports.
                  </p>
                  <a 
                    href="/" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Go to Home Page
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
} 