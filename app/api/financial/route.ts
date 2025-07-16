import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Input validation schema
const FinancialInputSchema = z.object({
  productType: z.enum(['saas', 'course', 'consulting', 'physical', 'digital']),
  pricePoint: z.number().min(1),
  subscriptionType: z.enum(['monthly', 'annual', 'one-time']),
  targetCustomers: z.number().min(1),
  conversionRate: z.number().min(0.1).max(100),
  churnRate: z.number().min(0).max(100),
  acquisitionCost: z.number().min(0),
  lifetimeValueMultiplier: z.number().min(1),
  upsellRate: z.number().min(0).max(100),
  upsellAmount: z.number().min(0),
  fixedCosts: z.number().min(0),
  variableCostPercentage: z.number().min(0).max(100),
  marketingBudget: z.number().min(0),
  timeframe: z.number().min(1).max(36),
  monthlyGrowthRate: z.number().min(0).max(100),
  seasonalityFactor: z.number().min(0.5).max(2)
});

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

interface ScenarioResults {
  name: string;
  totalRevenue: number;
  netProfit: number;
  breakEvenMonth: number;
  customerLifetimeValue: number;
  returnOnInvestment: number;
  monthlyData: MonthlyData[];
}

function calculateFinancialProjections(inputs: z.infer<typeof FinancialInputSchema>): ScenarioResults[] {
  // Generate Conservative, Realistic, and Optimistic scenarios
  const scenarios = [
    {
      name: 'Conservative',
      adjustments: {
        conversionRate: 0.7,
        monthlyGrowthRate: 0.6,
        churnRate: 1.3
      }
    },
    {
      name: 'Realistic',
      adjustments: {
        conversionRate: 1.0,
        monthlyGrowthRate: 1.0,
        churnRate: 1.0
      }
    },
    {
      name: 'Optimistic',
      adjustments: {
        conversionRate: 1.4,
        monthlyGrowthRate: 1.5,
        churnRate: 0.7
      }
    }
  ];

  return scenarios.map(scenario => {
    const adjustedInputs = {
      ...inputs,
      conversionRate: inputs.conversionRate * scenario.adjustments.conversionRate,
      monthlyGrowthRate: inputs.monthlyGrowthRate * scenario.adjustments.monthlyGrowthRate,
      churnRate: inputs.churnRate * scenario.adjustments.churnRate
    };

    return calculateScenario(adjustedInputs, scenario.name);
  });
}

function calculateScenario(params: z.infer<typeof FinancialInputSchema>, name: string): ScenarioResults {
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
    
    totalCustomers = Math.max(0, totalCustomers - churnedCustomers + newCustomers);
    
    // Revenue calculation
    let baseRevenue = totalCustomers * params.pricePoint;
    if (params.subscriptionType === 'annual') {
      baseRevenue = month === 1 ? totalCustomers * params.pricePoint * 12 : 
                    newCustomers * params.pricePoint * 12; // Only new customers pay annually
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
  const returnOnInvestment = totalInvestment > 0 ? ((netProfit - totalInvestment) / totalInvestment) * 100 : 0;

  return {
    name,
    totalRevenue: Math.round(totalRevenue),
    netProfit: Math.round(netProfit),
    breakEvenMonth: breakEvenMonth || params.timeframe + 1,
    customerLifetimeValue: Math.round(customerLifetimeValue),
    returnOnInvestment: Math.round(returnOnInvestment * 100) / 100,
    monthlyData
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedInput = FinancialInputSchema.parse(body);
    
    console.log('🧮 Calculating financial projections for:', validatedInput.productType);
    
    // Calculate projections
    const scenarios = calculateFinancialProjections(validatedInput);
    
    // Calculate additional insights
    const realisticScenario = scenarios.find(s => s.name === 'Realistic')!;
    const insights = generateFinancialInsights(validatedInput, realisticScenario);
    
    return NextResponse.json({
      success: true,
      scenarios,
      insights,
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Financial calculation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid input data', 
          details: error.errors,
          success: false 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        success: false 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'Enhanced Financial Calculator API',
    description: 'Advanced financial modeling and projections with scenario analysis',
    methods: ['POST'],
    endpoint: '/api/financial',
    parameters: {
      productType: 'enum - saas | course | consulting | physical | digital',
      pricePoint: 'number - Price per unit/customer in USD',
      subscriptionType: 'enum - monthly | annual | one-time',
      targetCustomers: 'number - Target number of customers',
      conversionRate: 'number - Expected conversion rate percentage (0.1-100)',
      churnRate: 'number - Monthly churn rate percentage (0-100)',
      acquisitionCost: 'number - Customer acquisition cost in USD',
      lifetimeValueMultiplier: 'number - LTV multiplier (1+)',
      upsellRate: 'number - Upsell rate percentage (0-100)',
      upsellAmount: 'number - Average upsell amount in USD',
      fixedCosts: 'number - Monthly fixed costs in USD',
      variableCostPercentage: 'number - Variable cost percentage (0-100)',
      marketingBudget: 'number - Monthly marketing budget in USD',
      timeframe: 'number - Projection timeframe in months (1-36)',
      monthlyGrowthRate: 'number - Monthly growth rate percentage (0-100)',
      seasonalityFactor: 'number - Seasonality multiplier (0.5-2)'
    },
    features: [
      'Multi-scenario financial modeling (Conservative, Realistic, Optimistic)',
      'Break-even analysis with detailed timelines',
      'Customer lifetime value calculations',
      'ROI and profitability metrics',
      'Monthly cash flow projections',
      'Growth rate and churn modeling',
      'Seasonality adjustments',
      'Advanced financial insights'
    ]
  });
}

function generateFinancialInsights(inputs: z.infer<typeof FinancialInputSchema>, scenario: ScenarioResults): any {
  const insights = {
    profitabilityAnalysis: {
      marginHealth: (scenario.netProfit / scenario.totalRevenue) * 100,
      breakEvenAnalysis: scenario.breakEvenMonth <= inputs.timeframe ? 'Achievable' : 'Challenging',
      riskLevel: scenario.returnOnInvestment > 100 ? 'Low' : scenario.returnOnInvestment > 50 ? 'Medium' : 'High'
    },
    customerMetrics: {
      ltvcacRatio: scenario.customerLifetimeValue / inputs.acquisitionCost,
      paybackPeriod: Math.ceil(inputs.acquisitionCost / (inputs.pricePoint * (inputs.subscriptionType === 'one-time' ? 1 : 12))),
      customerConcentrationRisk: inputs.targetCustomers < 100 ? 'High' : inputs.targetCustomers < 1000 ? 'Medium' : 'Low'
    },
    recommendations: generateRecommendations(inputs, scenario)
  };

  return insights;
}

function generateRecommendations(inputs: z.infer<typeof FinancialInputSchema>, scenario: ScenarioResults): string[] {
  const recommendations = [];

  // LTV:CAC ratio analysis
  const ltvCacRatio = scenario.customerLifetimeValue / inputs.acquisitionCost;
  if (ltvCacRatio < 3) {
    recommendations.push('Consider reducing customer acquisition costs or increasing customer lifetime value');
  }

  // Break-even analysis
  if (scenario.breakEvenMonth > inputs.timeframe) {
    recommendations.push('Extend projection timeframe or optimize cost structure to achieve break-even');
  }

  // Churn rate analysis
  if (inputs.churnRate > 10) {
    recommendations.push('High churn rate detected - focus on customer retention strategies');
  }

  // Growth rate analysis
  if (inputs.monthlyGrowthRate < 5) {
    recommendations.push('Consider strategies to increase monthly growth rate for better scaling');
  }

  // Profitability analysis
  const profitMargin = (scenario.netProfit / scenario.totalRevenue) * 100;
  if (profitMargin < 20) {
    recommendations.push('Improve profit margins by optimizing costs or increasing pricing');
  }

  return recommendations;
} 