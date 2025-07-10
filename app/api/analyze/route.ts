import { NextRequest, NextResponse } from 'next/server';
import { projectIntakeTool, revenueCalculatorTool, launchStrategyTool } from '../../../tools';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Validate required fields
    if (!formData.projectName || !formData.elevatorPitch || !formData.targetAudience) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Step 0: Real-time Market Research (NEW!)
    const marketResearch = await conductMarketResearch(formData);

    // Step 1: Project Intake Analysis (now enhanced with market data)
    const projectAnalysis = await projectIntakeTool.handler({
      projectName: formData.projectName,
      elevatorPitch: formData.elevatorPitch,
      creatorSkills: formData.creatorSkills || 'Solo founder',
      targetAudience: formData.targetAudience,
      launchGoal: formData.launchGoal || '$10k revenue in 60 days',
      launchWindow: formData.launchWindow || 'ASAP',
      riskTolerance: formData.riskTolerance || 'medium',
      existingAssets: formData.existingAssets || 'none',
      constraints: formData.constraints || 'none'
    });

    // Step 2: Revenue Projections (extract info from form)
    const pricePoint = extractPriceFromGoal(formData.launchGoal) || 97;
    const targetCustomers = extractCustomersFromGoal(formData.launchGoal) || 100;
    const productType = determineProductType(formData.elevatorPitch);
    
    const revenueProjections = await revenueCalculatorTool.handler({
      productType,
      pricePoint,
      targetCustomers,
      timeframe: 3 // 3 months default
    });

    // Step 3: Launch Strategy
    const launchStrategy = await launchStrategyTool.handler({
      projectType: productType,
      budget: extractBudgetFromSkills(formData.creatorSkills) || 1000,
      timeframe: parseTimeframe(formData.launchWindow) || 8,
      audienceSize: extractAudienceSize(formData.creatorSkills) || 0,
      revenueGoal: pricePoint * targetCustomers,
      channels: ['email', 'social', 'content']
    });

    // Combine all results (now with market research!)
    const result = {
      success: true,
      projectName: formData.projectName,
      analysis: {
        projectAnalysis,
        revenueProjections,
        launchStrategy,
        marketResearch // Add real market intelligence
      },
      generatedAt: new Date().toISOString()
    };

    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze project. Please try again.' },
      { status: 500 }
    );
  }
}

// Helper functions to extract data from form inputs
function extractPriceFromGoal(goal: string): number | null {
  const priceMatch = goal?.match(/\$(\d+(?:,\d+)*)/);
  return priceMatch ? parseInt(priceMatch[1].replace(',', '')) : null;
}

function extractCustomersFromGoal(goal: string): number | null {
  const customerMatch = goal?.match(/(\d+)\s*(customers|students|users)/i);
  return customerMatch ? parseInt(customerMatch[1]) : null;
}

function determineProductType(pitch: string): 'course' | 'saas' | 'consulting' | 'physical-product' | 'digital-product' {
  const lowerPitch = pitch?.toLowerCase() || '';
  
  if (lowerPitch.includes('course') || lowerPitch.includes('bootcamp') || lowerPitch.includes('training')) {
    return 'course';
  } else if (lowerPitch.includes('software') || lowerPitch.includes('app') || lowerPitch.includes('platform')) {
    return 'saas';
  } else if (lowerPitch.includes('consulting') || lowerPitch.includes('coaching') || lowerPitch.includes('service')) {
    return 'consulting';
  } else if (lowerPitch.includes('product') && lowerPitch.includes('physical')) {
    return 'physical-product';
  } else {
    return 'digital-product';
  }
}

function extractBudgetFromSkills(skills: string): number | null {
  const budgetMatch = skills?.match(/\$(\d+(?:,\d+)*)/);
  return budgetMatch ? parseInt(budgetMatch[1].replace(',', '')) : null;
}

function extractAudienceSize(skills: string): number {
  const audienceMatch = skills?.match(/(\d+(?:,\d+)*)\s*(followers|subscribers|email|list)/i);
  return audienceMatch ? parseInt(audienceMatch[1].replace(',', '')) : 0;
}

function parseTimeframe(window: string): number {
  const lowerWindow = window?.toLowerCase() || '';
  
  if (lowerWindow.includes('asap') || lowerWindow.includes('immediately')) {
    return 4; // 4 weeks
  } else if (lowerWindow.includes('month')) {
    const monthMatch = lowerWindow.match(/(\d+)\s*month/);
    return monthMatch ? parseInt(monthMatch[1]) * 4 : 8;
  } else if (lowerWindow.includes('week')) {
    const weekMatch = lowerWindow.match(/(\d+)\s*week/);
    return weekMatch ? parseInt(weekMatch[1]) : 8;
  } else {
    return 8; // Default 8 weeks
  }
}

// NEW: Real-time market research integration
async function conductMarketResearch(formData: any) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/api/market-research`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectName: formData.projectName,
        targetAudience: formData.targetAudience,
        elevatorPitch: formData.elevatorPitch
      })
    });

    if (!response.ok) {
      throw new Error(`Market research failed: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Market research integration failed:', error);
    // Fallback to basic market research
    return {
      marketResearch: {
        marketSize: 'Market research temporarily unavailable',
        keyTrends: ['Unable to fetch current trends'],
        opportunities: ['Real-time market analysis unavailable'],
        threats: ['Unable to assess current market threats'],
        sources: []
      },
      competitorAnalysis: {
        directCompetitors: ['Competitor analysis temporarily unavailable'],
        priceComparison: 'Pricing data unavailable',
        featureGaps: ['Unable to analyze competitive gaps'],
        positioning: 'Market positioning analysis unavailable'
      },
      trendAnalysis: {
        growingTrends: ['Trend analysis temporarily unavailable'],
        decliningTrends: ['Trend analysis temporarily unavailable'],
        emergingOpportunities: ['Trend analysis temporarily unavailable']
      },
      insights: {
        marketViabilityScore: 70,
        recommendedStrategy: 'Focus on unique value proposition and market differentiation',
        keyRisks: ['Market uncertainty', 'Competitive pressure', 'Technology changes'],
        successFactors: ['Strong execution', 'Market timing', 'Customer focus']
      }
    };
  }
} 