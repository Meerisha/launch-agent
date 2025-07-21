"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { TrendingUp, DollarSign, Users, Calendar, Target, Zap, AlertCircle, CheckCircle } from 'lucide-react'

interface MetricsState {
  // Core business metrics
  monthlyRevenue: number
  customerAcquisitionRate: number
  churnRate: number
  avgRevenuePerUser: number
  burnRate: number
  
  // Pricing and market variables
  pricePoint: number
  marketSize: number
  conversionRate: number
  marketGrowthRate: number
  
  // Operational metrics
  teamSize: number
  runwayMonths: number
  currentCash: number
}

interface ScenarioResult {
  revenue: number[]
  customers: number[]
  cashFlow: number[]
  runway: number
  breakEven: number
  totalAddressableMarket: number
}

interface MetricCard {
  title: string
  value: string | number
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: React.ReactNode
}

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState<MetricsState>({
    monthlyRevenue: 15000,
    customerAcquisitionRate: 50,
    churnRate: 5,
    avgRevenuePerUser: 97,
    burnRate: 8000,
    pricePoint: 97,
    marketSize: 50000000,
    conversionRate: 3.5,
    marketGrowthRate: 15,
    teamSize: 3,
    runwayMonths: 18,
    currentCash: 150000
  })

  // Real-time scenario calculations
  const scenarioResults = useMemo((): ScenarioResult => {
    const months = 24
    const revenue: number[] = []
    const customers: number[] = []
    const cashFlow: number[] = []
    
    let currentRevenue = metrics.monthlyRevenue
    let currentCustomers = Math.round(currentRevenue / metrics.avgRevenuePerUser)
    let currentCash = metrics.currentCash
    let breakEvenMonth = 0

    for (let i = 0; i < months; i++) {
      // Customer growth with churn
      const newCustomers = Math.round(metrics.customerAcquisitionRate * (1 + metrics.marketGrowthRate / 100 / 12))
      const churnedCustomers = Math.round(currentCustomers * (metrics.churnRate / 100))
      currentCustomers = Math.max(0, currentCustomers + newCustomers - churnedCustomers)
      
      // Revenue calculation
      currentRevenue = currentCustomers * metrics.avgRevenuePerUser
      
      // Cash flow calculation
      const monthlyCashFlow = currentRevenue - metrics.burnRate
      currentCash += monthlyCashFlow
      
      // Track break-even
      if (monthlyCashFlow > 0 && breakEvenMonth === 0) {
        breakEvenMonth = i + 1
      }
      
      revenue.push(Math.round(currentRevenue))
      customers.push(currentCustomers)
      cashFlow.push(Math.round(currentCash))
    }

    const totalAddressableMarket = metrics.marketSize * (metrics.conversionRate / 100)
    const runway = currentCash > 0 ? Math.round(currentCash / metrics.burnRate) : 0

    return {
      revenue,
      customers,
      cashFlow,
      runway,
      breakEven: breakEvenMonth,
      totalAddressableMarket
    }
  }, [metrics])

  // Generate chart data
  const chartData = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      month: `Month ${i + 1}`,
      revenue: scenarioResults.revenue[i] || 0,
      customers: scenarioResults.customers[i] || 0,
      cashFlow: scenarioResults.cashFlow[i] || 0,
      cumulative: scenarioResults.revenue.slice(0, i + 1).reduce((sum, val) => sum + val, 0)
    }))
  }, [scenarioResults])

  // Key metrics cards
  const keyMetrics: MetricCard[] = [
    {
      title: 'Monthly Revenue',
      value: `$${metrics.monthlyRevenue.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up',
      icon: <DollarSign className="w-6 h-6" />
    },
    {
      title: 'Customer Acquisition',
      value: `${metrics.customerAcquisitionRate}/month`,
      change: '+8.2%',
      trend: 'up',
      icon: <Users className="w-6 h-6" />
    },
    {
      title: 'Runway',
      value: `${scenarioResults.runway} months`,
      change: scenarioResults.runway > 12 ? 'Healthy' : 'Warning',
      trend: scenarioResults.runway > 12 ? 'up' : 'down',
      icon: <Calendar className="w-6 h-6" />
    },
    {
      title: 'Break-even',
      value: scenarioResults.breakEven > 0 ? `Month ${scenarioResults.breakEven}` : 'Not projected',
      change: scenarioResults.breakEven > 0 && scenarioResults.breakEven <= 12 ? 'On track' : 'Delayed',
      trend: scenarioResults.breakEven > 0 && scenarioResults.breakEven <= 12 ? 'up' : 'neutral',
      icon: <Target className="w-6 h-6" />
    }
  ]

  const updateMetric = (key: keyof MetricsState, value: number) => {
    setMetrics(prev => ({ ...prev, [key]: value }))
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Metrics Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time business metrics and scenario modeling</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow">
          <Zap className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium text-gray-700">Live Updates</span>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${
                metric.trend === 'up' ? 'bg-green-100 text-green-600' :
                metric.trend === 'down' ? 'bg-red-100 text-red-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {metric.icon}
              </div>
              <div className={`text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' :
                metric.trend === 'down' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {metric.change}
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Projection Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Projection (24 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Growth Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [Number(value).toLocaleString(), 'Customers']} />
              <Line type="monotone" dataKey="customers" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cash Flow and Scenario Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow Runway</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Cash']} />
              <Area 
                type="monotone" 
                dataKey="cashFlow" 
                stroke="#F59E0B" 
                fill="#F59E0B" 
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Scenario Controls */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scenario Modeling</h3>
          <div className="space-y-6">
            {/* Price Point */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Point: ${metrics.pricePoint}
              </label>
              <input
                type="range"
                min="10"
                max="500"
                value={metrics.pricePoint}
                onChange={(e) => updateMetric('pricePoint', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Customer Acquisition Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Acquisitions: {metrics.customerAcquisitionRate}
              </label>
              <input
                type="range"
                min="1"
                max="200"
                value={metrics.customerAcquisitionRate}
                onChange={(e) => updateMetric('customerAcquisitionRate', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Churn Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Churn Rate: {metrics.churnRate}%
              </label>
              <input
                type="range"
                min="0"
                max="20"
                step="0.5"
                value={metrics.churnRate}
                onChange={(e) => updateMetric('churnRate', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Burn Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Burn: ${metrics.burnRate.toLocaleString()}
              </label>
              <input
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={metrics.burnRate}
                onChange={(e) => updateMetric('burnRate', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Market Growth Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Market Growth: {metrics.marketGrowthRate}%
              </label>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={metrics.marketGrowthRate}
                onChange={(e) => updateMetric('marketGrowthRate', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Insights and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Insights */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-3">
            {scenarioResults.breakEven > 0 && (
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Break-even projected</p>
                  <p className="text-sm text-green-600">Reaching profitability in month {scenarioResults.breakEven}</p>
                </div>
              </div>
            )}
            
            {scenarioResults.runway < 6 && (
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Low runway warning</p>
                  <p className="text-sm text-red-600">Only {scenarioResults.runway} months of cash remaining</p>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Market opportunity</p>
                <p className="text-sm text-blue-600">
                  TAM: ${(scenarioResults.totalAddressableMarket / 1000000).toFixed(1)}M potential
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Scenarios</h3>
          <div className="space-y-3">
            <button
              onClick={() => {
                setMetrics(prev => ({
                  ...prev,
                  pricePoint: prev.pricePoint * 1.2,
                  customerAcquisitionRate: prev.customerAcquisitionRate * 0.9
                }))
              }}
              className="w-full text-left p-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
            >
              <p className="font-medium text-white">Premium Pricing Strategy</p>
              <p className="text-sm text-blue-100">+20% price, -10% acquisition</p>
            </button>

            <button
              onClick={() => {
                setMetrics(prev => ({
                  ...prev,
                  customerAcquisitionRate: prev.customerAcquisitionRate * 1.5,
                  burnRate: prev.burnRate * 1.3
                }))
              }}
              className="w-full text-left p-3 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
            >
              <p className="font-medium text-white">Growth Mode</p>
              <p className="text-sm text-green-100">+50% acquisition, +30% burn</p>
            </button>

            <button
              onClick={() => {
                setMetrics(prev => ({
                  ...prev,
                  burnRate: prev.burnRate * 0.7,
                  customerAcquisitionRate: prev.customerAcquisitionRate * 0.8
                }))
              }}
              className="w-full text-left p-3 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors"
            >
              <p className="font-medium text-white">Conservative Mode</p>
              <p className="text-sm text-purple-100">-30% burn, -20% acquisition</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 