import { z } from "zod";

const RevenueCalculatorSchema = z.object({
  productType: z.enum(["course", "saas", "consulting", "physical-product", "digital-product"]).describe("Type of product"),
  pricePoint: z.number().min(1).describe("Price per unit/customer in USD"),
  targetCustomers: z.number().min(1).describe("Target number of customers"),
  timeframe: z.number().min(1).max(12).describe("Timeframe in months"),
  conversionRate: z.number().min(0.1).max(50).optional().describe("Expected conversion rate percentage"),
  churnRate: z.number().min(0).max(100).optional().describe("Monthly churn rate percentage (for subscription products)"),
  upsellRate: z.number().min(0).max(100).optional().describe("Percentage of customers who purchase additional products")
});

export const revenueCalculatorTool = {
  name: "calculate_revenue_projections",
  description: "Calculate detailed revenue projections, break-even analysis, and financial forecasts",
  inputSchema: RevenueCalculatorSchema,
  handler: async (input: z.infer<typeof RevenueCalculatorSchema>) => {
    const projections = calculateProjections(input);
    return {
      summary: projections,
      monthlyBreakdown: generateMonthlyBreakdown(input),
      breakEvenAnalysis: calculateBreakEven(input),
      scenarioAnalysis: generateScenarios(input),
      recommendations: generateRecommendations(input, projections)
    };
  },
};

function calculateProjections(input: z.infer<typeof RevenueCalculatorSchema>) {
  const { productType, pricePoint, targetCustomers, timeframe } = input;
  const conversionRate = input.conversionRate || getDefaultConversionRate(productType);
  const churnRate = input.churnRate || getDefaultChurnRate(productType);
  const upsellRate = input.upsellRate || getDefaultUpsellRate(productType);
  
  const baseRevenue = pricePoint * targetCustomers;
  const adjustedRevenue = calculateAdjustedRevenue(baseRevenue, productType, timeframe, churnRate);
  const upsellRevenue = calculateUpsellRevenue(adjustedRevenue, upsellRate, productType);
  const totalRevenue = adjustedRevenue + upsellRevenue;
  
  return {
    baseRevenue: Math.round(baseRevenue),
    adjustedRevenue: Math.round(adjustedRevenue),
    upsellRevenue: Math.round(upsellRevenue),
    totalRevenue: Math.round(totalRevenue),
    monthlyAverage: Math.round(totalRevenue / timeframe),
    conversionRate: conversionRate,
    churnRate: churnRate,
    requiredLeads: Math.ceil(targetCustomers / (conversionRate / 100))
  };
}

function getDefaultConversionRate(productType: string): number {
  const rates = {
    course: 3.0,        // 3% conversion rate for online courses
    saas: 2.5,          // 2.5% for SaaS free trials
    consulting: 15.0,   // 15% for high-touch consulting
    "physical-product": 2.0, // 2% for e-commerce
    "digital-product": 4.0   // 4% for digital products
  };
  return rates[productType as keyof typeof rates] || 3.0;
}

function getDefaultChurnRate(productType: string): number {
  const rates = {
    course: 0,          // One-time purchase
    saas: 8.0,          // 8% monthly churn for SaaS
    consulting: 5.0,    // 5% for ongoing consulting
    "physical-product": 0, // One-time purchase  
    "digital-product": 0   // One-time purchase
  };
  return rates[productType as keyof typeof rates] || 0;
}

function getDefaultUpsellRate(productType: string): number {
  const rates = {
    course: 25.0,       // 25% buy additional courses
    saas: 15.0,         // 15% upgrade to higher tiers
    consulting: 40.0,   // 40% extend or expand services
    "physical-product": 20.0, // 20% buy complementary products
    "digital-product": 30.0   // 30% buy related digital products
  };
  return rates[productType as keyof typeof rates] || 20.0;
}

function calculateAdjustedRevenue(baseRevenue: number, productType: string, timeframe: number, churnRate: number): number {
  if (productType === 'saas' && churnRate > 0) {
    // For SaaS, calculate revenue considering churn over timeframe
    const monthlyChurn = churnRate / 100;
    const retentionRate = 1 - monthlyChurn;
    const retentionFactor = (1 - Math.pow(retentionRate, timeframe)) / (1 - retentionRate);
    return baseRevenue * retentionFactor;
  }
  return baseRevenue;
}

function calculateUpsellRevenue(baseRevenue: number, upsellRate: number, productType: string): number {
  const upsellMultipliers = {
    course: 1.5,        // Additional courses at 1.5x price
    saas: 2.0,          // Premium plans at 2x price
    consulting: 1.8,    // Extended engagements at 1.8x
    "physical-product": 0.7, // Accessories at 0.7x price
    "digital-product": 1.2   // Add-ons at 1.2x price
  };
  
  const multiplier = upsellMultipliers[productType as keyof typeof upsellMultipliers] || 1.0;
  return baseRevenue * (upsellRate / 100) * multiplier;
}

function generateMonthlyBreakdown(input: z.infer<typeof RevenueCalculatorSchema>) {
  const { targetCustomers, timeframe, pricePoint, productType } = input;
  const churnRate = input.churnRate || getDefaultChurnRate(productType);
  
  const monthlyBreakdown = [];
  let cumulativeCustomers = 0;
  let cumulativeRevenue = 0;
  
  for (let month = 1; month <= timeframe; month++) {
    const newCustomers = Math.ceil(targetCustomers / timeframe);
    const churnedCustomers = productType === 'saas' ? 
      Math.ceil(cumulativeCustomers * (churnRate / 100)) : 0;
    
    cumulativeCustomers += newCustomers - churnedCustomers;
    const monthlyRevenue = productType === 'saas' ? 
      cumulativeCustomers * pricePoint : 
      newCustomers * pricePoint;
    
    cumulativeRevenue += monthlyRevenue;
    
    monthlyBreakdown.push({
      month: month,
      newCustomers: newCustomers,
      churnedCustomers: churnedCustomers,
      totalCustomers: cumulativeCustomers,
      monthlyRevenue: Math.round(monthlyRevenue),
      cumulativeRevenue: Math.round(cumulativeRevenue)
    });
  }
  
  return monthlyBreakdown;
}

function calculateBreakEven(input: z.infer<typeof RevenueCalculatorSchema>) {
  const { productType, pricePoint } = input;
  const estimatedCosts = getEstimatedCosts(productType, pricePoint);
  
  const breakEvenUnits = Math.ceil(estimatedCosts.total / pricePoint);
  const profitMargin = ((pricePoint - estimatedCosts.perUnit) / pricePoint) * 100;
  
  return {
    breakEvenUnits: breakEvenUnits,
    estimatedCosts: estimatedCosts,
    profitMargin: Math.round(profitMargin * 100) / 100,
    timeToBreakEven: calculateTimeToBreakEven(breakEvenUnits, input)
  };
}

function getEstimatedCosts(productType: string, pricePoint: number) {
  const costStructures = {
    course: {
      fixed: 2000,    // Platform, tools, initial content creation
      variable: 0.1   // 10% payment processing, support
    },
    saas: {
      fixed: 5000,    // Development, hosting, tools
      variable: 0.25  // 25% for hosting, support, development
    },
    consulting: {
      fixed: 1000,    // Tools, setup
      variable: 0.3   // 30% for time, resources
    },
    "physical-product": {
      fixed: 3000,    // Inventory, storage
      variable: 0.4   // 40% for product cost, shipping
    },
    "digital-product": {
      fixed: 1500,    // Creation tools, design
      variable: 0.15  // 15% for processing, delivery
    }
  };
  
  const structure = costStructures[productType as keyof typeof costStructures] || costStructures["digital-product"];
  
  return {
    fixed: structure.fixed,
    perUnit: pricePoint * structure.variable,
    total: structure.fixed
  };
}

function calculateTimeToBreakEven(breakEvenUnits: number, input: z.infer<typeof RevenueCalculatorSchema>) {
  const { targetCustomers, timeframe } = input;
  const customersPerMonth = targetCustomers / timeframe;
  return Math.ceil(breakEvenUnits / customersPerMonth);
}

function generateScenarios(input: z.infer<typeof RevenueCalculatorSchema>) {
  const baseProjections = calculateProjections(input);
  
  // Conservative: 50% of targets
  const conservative = calculateProjections({
    ...input,
    targetCustomers: Math.ceil(input.targetCustomers * 0.5),
    conversionRate: (input.conversionRate || getDefaultConversionRate(input.productType)) * 0.7
  });
  
  // Optimistic: 150% of targets  
  const optimistic = calculateProjections({
    ...input,
    targetCustomers: Math.ceil(input.targetCustomers * 1.5),
    conversionRate: (input.conversionRate || getDefaultConversionRate(input.productType)) * 1.3
  });
  
  return {
    conservative: {
      revenue: conservative.totalRevenue,
      probability: "70%"
    },
    realistic: {
      revenue: baseProjections.totalRevenue,
      probability: "50%"
    },
    optimistic: {
      revenue: optimistic.totalRevenue,
      probability: "20%"
    }
  };
}

function generateRecommendations(input: z.infer<typeof RevenueCalculatorSchema>, projections: any) {
  const recommendations = [];
  
  // Price optimization
  if (projections.profitMargin < 50) {
    recommendations.push({
      category: "Pricing",
      recommendation: "Consider increasing price point - current margin may be too low",
      impact: "High"
    });
  }
  
  // Conversion rate optimization
  if (projections.conversionRate < 2) {
    recommendations.push({
      category: "Marketing",
      recommendation: "Focus on conversion rate optimization - current rate is below average",
      impact: "High"
    });
  }
  
  // Customer acquisition
  if (projections.requiredLeads > projections.targetCustomers * 50) {
    recommendations.push({
      category: "Lead Generation",
      recommendation: "Need strong lead generation strategy - high lead volume required",
      impact: "Critical"
    });
  }
  
  // Product-specific recommendations
  const productRecommendations = getProductSpecificRecommendations(input.productType, input.pricePoint);
  recommendations.push(...productRecommendations);
  
  return recommendations;
}

function getProductSpecificRecommendations(productType: string, pricePoint: number) {
  const recommendations = [];
  
  switch (productType) {
    case 'course':
      if (pricePoint < 100) {
        recommendations.push({
          category: "Pricing",
          recommendation: "Course pricing seems low - consider premium positioning",
          impact: "Medium"
        });
      }
      recommendations.push({
        category: "Strategy",
        recommendation: "Plan for course completion rates and student success metrics",
        impact: "Medium"
      });
      break;
      
    case 'saas':
      recommendations.push({
        category: "Strategy", 
        recommendation: "Focus on reducing churn rate and increasing customer lifetime value",
        impact: "High"
      });
      if (pricePoint < 20) {
        recommendations.push({
          category: "Pricing",
          recommendation: "SaaS pricing may be too low for sustainable unit economics",
          impact: "High"
        });
      }
      break;
      
    case 'consulting':
      recommendations.push({
        category: "Strategy",
        recommendation: "Develop scalable processes and consider productized consulting",
        impact: "Medium"
      });
      break;
      
    default:
      recommendations.push({
        category: "General",
        recommendation: "Focus on customer feedback and product-market fit validation",
        impact: "Medium"
      });
  }
  
  return recommendations;
} 