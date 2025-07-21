'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Target, Calculator, PieChart as PieChartIcon, BarChart3, Download, Settings } from 'lucide-react';

interface FinancialInputs {
  // Product & Pricing
  productType: 'saas' | 'course' | 'consulting' | 'physical' | 'digital';
  pricePoint: number;
  subscriptionType: 'monthly' | 'annual' | 'one-time';
  
  // Customer Metrics
  targetCustomers: number;
  conversionRate: number;
  churnRate: number;
  
  // Business Model
  acquisitionCost: number;
  lifetimeValueMultiplier: number;
  upsellRate: number;
  upsellAmount: number;
  
  // Costs
  fixedCosts: number;
  variableCostPercentage: number;
  marketingBudget: number;
  
  // Time & Growth
  timeframe: number;
  monthlyGrowthRate: number;
  seasonalityFactor: number;
}

interface ScenarioResults {
  name: string;
  totalRevenue: number;
  netProfit: number;
  breakEvenMonth: number;
  customerLifetimeValue: number;
  returnOnInvestment: number;
  monthlyData: MonthlyData[];
}

interface MonthlyData {
  month: number;
  monthName: string;
  newCustomers: number;
  totalCustomers: number;
  monthlyRevenue: number;
  cumulativeRevenue: number;
  costs: number;
  profit: number;
  cumulativeProfit: number;
  cashFlow: number;
}

const COLORS = ['#2563eb', '#059669', '#dc2626', '#7c3aed', '#ea580c'];

const productTypeDefaults = {
  saas: { price: 97, conversion: 2.5, churn: 5, cac: 150, ltv: 3 },
  course: { price: 497, conversion: 3.5, churn: 0, cac: 80, ltv: 1 },
  consulting: { price: 5000, conversion: 10, churn: 15, cac: 500, ltv: 2 },
  physical: { price: 49, conversion: 1.8, churn: 0, cac: 25, ltv: 1 },
  digital: { price: 29, conversion: 4.2, churn: 0, cac: 15, ltv: 1 }
};

export default function EnhancedFinancialCalculator() {
  const [inputs, setInputs] = useState<FinancialInputs>({
    productType: 'saas',
    pricePoint: 97,
    subscriptionType: 'monthly',
    targetCustomers: 1000,
    conversionRate: 2.5,
    churnRate: 5,
    acquisitionCost: 150,
    lifetimeValueMultiplier: 3,
    upsellRate: 20,
    upsellAmount: 200,
    fixedCosts: 5000,
    variableCostPercentage: 20,
    marketingBudget: 10000,
    timeframe: 12,
    monthlyGrowthRate: 15,
    seasonalityFactor: 1
  });

  const [activeTab, setActiveTab] = useState<'inputs' | 'scenarios' | 'charts' | 'breakdown'>('inputs');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Update defaults when product type changes
  useEffect(() => {
    const defaults = productTypeDefaults[inputs.productType];
    setInputs(prev => ({
      ...prev,
      pricePoint: defaults.price,
      conversionRate: defaults.conversion,
      churnRate: defaults.churn,
      acquisitionCost: defaults.cac,
      lifetimeValueMultiplier: defaults.ltv
    }));
  }, [inputs.productType]);

  // Calculate scenarios
  const scenarios = useMemo(() => {
    const baseScenario = calculateScenario(inputs, 'Realistic');
    
    const conservativeInputs = {
      ...inputs,
      conversionRate: inputs.conversionRate * 0.7,
      monthlyGrowthRate: inputs.monthlyGrowthRate * 0.6,
      churnRate: inputs.churnRate * 1.3
    };
    
    const optimisticInputs = {
      ...inputs,
      conversionRate: inputs.conversionRate * 1.4,
      monthlyGrowthRate: inputs.monthlyGrowthRate * 1.5,
      churnRate: inputs.churnRate * 0.7
    };

    return [
      calculateScenario(conservativeInputs, 'Conservative'),
      baseScenario,
      calculateScenario(optimisticInputs, 'Optimistic')
    ];
  }, [inputs]);

  function calculateScenario(params: FinancialInputs, name: string): ScenarioResults {
    const monthlyData: MonthlyData[] = [];
    let totalCustomers = 0;
    let cumulativeRevenue = 0;
    let cumulativeProfit = 0;

    for (let month = 1; month <= params.timeframe; month++) {
      // Growth calculation with seasonality
      const growthFactor = Math.pow(1 + params.monthlyGrowthRate / 100, month - 1);
      const seasonalMultiplier = 1 + (Math.sin((month - 1) * Math.PI / 6) * (params.seasonalityFactor - 1));
      
      // Customer acquisition
      const leadsThisMonth = (params.marketingBudget / params.acquisitionCost) * growthFactor * seasonalMultiplier;
      const newCustomers = leadsThisMonth * (params.conversionRate / 100);
      
      // Churn calculation (for subscription models)
      const churnedCustomers = params.subscriptionType !== 'one-time' ? 
        totalCustomers * (params.churnRate / 100) : 0;
      
      totalCustomers = totalCustomers - churnedCustomers + newCustomers;
      
      // Revenue calculation
      let baseRevenue = totalCustomers * params.pricePoint;
      if (params.subscriptionType === 'annual') {
        baseRevenue = month === 1 ? totalCustomers * params.pricePoint * 12 : 0;
      }
      
      // Upsell revenue
      const upsellRevenue = newCustomers * (params.upsellRate / 100) * params.upsellAmount;
      const monthlyRevenue = baseRevenue + upsellRevenue;
      
      cumulativeRevenue += monthlyRevenue;
      
      // Cost calculation
      const variableCosts = monthlyRevenue * (params.variableCostPercentage / 100);
      const marketingCosts = params.marketingBudget;
      const totalCosts = params.fixedCosts + variableCosts + marketingCosts;
      
      const profit = monthlyRevenue - totalCosts;
      cumulativeProfit += profit;
      
      monthlyData.push({
        month,
        monthName: new Date(2024, month - 1).toLocaleString('default', { month: 'short' }),
        newCustomers: Math.round(newCustomers),
        totalCustomers: Math.round(totalCustomers),
        monthlyRevenue: Math.round(monthlyRevenue),
        cumulativeRevenue: Math.round(cumulativeRevenue),
        costs: Math.round(totalCosts),
        profit: Math.round(profit),
        cumulativeProfit: Math.round(cumulativeProfit),
        cashFlow: Math.round(monthlyRevenue - totalCosts)
      });
    }

    // Calculate key metrics
    const totalRevenue = cumulativeRevenue;
    const netProfit = cumulativeProfit;
    const breakEvenMonth = monthlyData.findIndex(m => m.cumulativeProfit > 0) + 1;
    const customerLifetimeValue = params.pricePoint * params.lifetimeValueMultiplier;
    const totalInvestment = params.fixedCosts * params.timeframe + params.marketingBudget * params.timeframe;
    const returnOnInvestment = ((netProfit - totalInvestment) / totalInvestment) * 100;

    return {
      name,
      totalRevenue,
      netProfit,
      breakEvenMonth: breakEvenMonth || params.timeframe + 1,
      customerLifetimeValue,
      returnOnInvestment,
      monthlyData
    };
  }

  const handleInputChange = (field: keyof FinancialInputs, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    }));
  };

  const exportData = () => {
    const data = {
      inputs,
      scenarios,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'financial-projections.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Enhanced Financial Calculator</h2>
          <p className="text-gray-600">Interactive financial modeling with scenario analysis and projections</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </button>
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'inputs', label: 'Inputs', icon: Calculator },
          { id: 'scenarios', label: 'Scenarios', icon: Target },
          { id: 'charts', label: 'Charts', icon: BarChart3 },
          { id: 'breakdown', label: 'Breakdown', icon: PieChartIcon }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Inputs Tab */}
      {activeTab === 'inputs' && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Basic Inputs */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Product & Pricing</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
                  <select
                    value={inputs.productType}
                    onChange={(e) => handleInputChange('productType', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="saas">SaaS / Software</option>
                    <option value="course">Online Course</option>
                    <option value="consulting">Consulting Services</option>
                    <option value="physical">Physical Product</option>
                    <option value="digital">Digital Product</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Point ($)</label>
                  <input
                    type="number"
                    value={inputs.pricePoint}
                    onChange={(e) => handleInputChange('pricePoint', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Type</label>
                  <select
                    value={inputs.subscriptionType}
                    onChange={(e) => handleInputChange('subscriptionType', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="monthly">Monthly Subscription</option>
                    <option value="annual">Annual Subscription</option>
                    <option value="one-time">One-time Payment</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Customer Metrics</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Customers</label>
                  <input
                    type="number"
                    value={inputs.targetCustomers}
                    onChange={(e) => handleInputChange('targetCustomers', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Conversion Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.conversionRate}
                    onChange={(e) => handleInputChange('conversionRate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Churn Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.churnRate}
                    onChange={(e) => handleInputChange('churnRate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Inputs */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Business Model</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Acquisition Cost ($)</label>
                  <input
                    type="number"
                    value={inputs.acquisitionCost}
                    onChange={(e) => handleInputChange('acquisitionCost', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LTV Multiplier</label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.lifetimeValueMultiplier}
                    onChange={(e) => handleInputChange('lifetimeValueMultiplier', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {showAdvanced && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upsell Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={inputs.upsellRate}
                        onChange={(e) => handleInputChange('upsellRate', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upsell Amount ($)</label>
                      <input
                        type="number"
                        value={inputs.upsellAmount}
                        onChange={(e) => handleInputChange('upsellAmount', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Costs & Growth</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fixed Costs ($/month)</label>
                  <input
                    type="number"
                    value={inputs.fixedCosts}
                    onChange={(e) => handleInputChange('fixedCosts', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Variable Cost (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.variableCostPercentage}
                    onChange={(e) => handleInputChange('variableCostPercentage', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marketing Budget ($/month)</label>
                  <input
                    type="number"
                    value={inputs.marketingBudget}
                    onChange={(e) => handleInputChange('marketingBudget', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Growth Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.monthlyGrowthRate}
                    onChange={(e) => handleInputChange('monthlyGrowthRate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe (months)</label>
                  <input
                    type="number"
                    min="1"
                    max="36"
                    value={inputs.timeframe}
                    onChange={(e) => handleInputChange('timeframe', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scenarios Tab */}
      {activeTab === 'scenarios' && (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid md:grid-cols-3 gap-6">
            {scenarios.map((scenario, index) => (
              <div key={scenario.name} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200">
                <h3 className={`text-xl font-bold mb-4 ${
                  index === 0 ? 'text-red-600' : index === 1 ? 'text-blue-600' : 'text-green-600'
                }`}>
                  {scenario.name} Scenario
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="font-semibold text-gray-900">
                      ${scenario.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Net Profit</span>
                    <span className={`font-semibold ${scenario.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${scenario.netProfit.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Break-even</span>
                    <span className="font-semibold text-gray-900">
                      Month {scenario.breakEvenMonth}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Customer LTV</span>
                    <span className="font-semibold text-gray-900">
                      ${scenario.customerLifetimeValue.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">ROI</span>
                    <span className={`font-semibold ${scenario.returnOnInvestment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {scenario.returnOnInvestment.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scenario Comparison Chart */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Revenue Comparison</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthName" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Legend />
                {scenarios.map((scenario, index) => (
                  <Line
                    key={scenario.name}
                    dataKey="cumulativeRevenue"
                    data={scenario.monthlyData}
                    stroke={COLORS[index]}
                    strokeWidth={2}
                    name={scenario.name}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Charts Tab */}
      {activeTab === 'charts' && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Cash Flow Chart */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Cash Flow Projection</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={scenarios[1].monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthName" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']} />
                <Area 
                  type="monotone" 
                  dataKey="cashFlow" 
                  stroke="#2563eb" 
                  fill="#2563eb" 
                  fillOpacity={0.6}
                  name="Cash Flow"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Customer Growth */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Customer Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scenarios[1].monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="newCustomers" fill="#059669" name="New Customers" />
                <Bar dataKey="totalCustomers" fill="#2563eb" name="Total Customers" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue vs Costs */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Revenue vs Costs</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scenarios[1].monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthName" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']} />
                <Line type="monotone" dataKey="monthlyRevenue" stroke="#059669" strokeWidth={2} name="Revenue" />
                <Line type="monotone" dataKey="costs" stroke="#dc2626" strokeWidth={2} name="Costs" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Profit Trajectory */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Profit Trajectory</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={scenarios[1].monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthName" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Profit']} />
                <Area 
                  type="monotone" 
                  dataKey="cumulativeProfit" 
                  stroke="#7c3aed" 
                  fill="#7c3aed" 
                  fillOpacity={0.6}
                  name="Cumulative Profit"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Breakdown Tab */}
      {activeTab === 'breakdown' && (
        <div className="space-y-8">
          {/* Monthly Breakdown Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">Monthly Financial Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Customers</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Customers</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costs</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cumulative</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scenarios[1].monthlyData.map((month) => (
                    <tr key={month.month} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {month.monthName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {month.newCustomers.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {month.totalCustomers.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${month.monthlyRevenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${month.costs.toLocaleString()}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        month.profit >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${month.profit.toLocaleString()}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        month.cumulativeProfit >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${month.cumulativeProfit.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Metrics Summary */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-8 h-8 text-blue-600" />
                <h4 className="font-semibold text-gray-900">Total Revenue</h4>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                ${scenarios[1].totalRevenue.toLocaleString()}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <h4 className="font-semibold text-gray-900">Net Profit</h4>
              </div>
              <p className={`text-2xl font-bold ${scenarios[1].netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${scenarios[1].netProfit.toLocaleString()}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-8 h-8 text-purple-600" />
                <h4 className="font-semibold text-gray-900">Break-even</h4>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                Month {scenarios[1].breakEvenMonth}
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Calculator className="w-8 h-8 text-orange-600" />
                <h4 className="font-semibold text-gray-900">ROI</h4>
              </div>
              <p className={`text-2xl font-bold ${scenarios[1].returnOnInvestment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {scenarios[1].returnOnInvestment.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 