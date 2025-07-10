import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { projectName, targetAudience, elevatorPitch } = await request.json();
    
    if (!projectName || !targetAudience || !elevatorPitch) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Step 1: Market research with Tavily
    const marketResearch = await searchMarketIntelligence(projectName, targetAudience);
    
    // Step 2: Competitive analysis with Firecrawl
    const competitorAnalysis = await analyzeCompetitors(projectName, elevatorPitch);
    
    // Step 3: Trend analysis
    const trendAnalysis = await analyzeTrends(projectName, targetAudience);
    
    return NextResponse.json({
      success: true,
      data: {
        marketResearch,
        competitorAnalysis,
        trendAnalysis,
        insights: generateInsights(marketResearch, competitorAnalysis, trendAnalysis)
      }
    });
    
  } catch (error) {
    console.error('Market research error:', error);
    return NextResponse.json(
      { error: 'Failed to conduct market research' },
      { status: 500 }
    );
  }
}

async function searchMarketIntelligence(projectName: string, targetAudience: string) {
  const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
  
  if (!TAVILY_API_KEY) {
    throw new Error('Tavily API key not configured');
  }
  
  try {
    const searchQuery = `${projectName} market size ${targetAudience} industry trends 2024`;
    
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TAVILY_API_KEY}`
      },
      body: JSON.stringify({
        query: searchQuery,
        search_depth: 'advanced',
        include_answer: true,
        include_raw_content: false,
        max_results: 10
      })
    });
    
    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      marketSize: extractMarketSize(data.answer),
      keyTrends: extractTrends(data.results),
      opportunities: extractOpportunities(data.results),
      threats: extractThreats(data.results),
      sources: data.results.map((r: any) => ({ title: r.title, url: r.url }))
    };
    
  } catch (error) {
    console.error('Tavily search failed:', error);
    // Fallback to basic analysis
    return {
      marketSize: 'Market research temporarily unavailable',
      keyTrends: ['Unable to fetch current trends'],
      opportunities: ['Market research service unavailable'],
      threats: ['Unable to assess current threats'],
      sources: []
    };
  }
}

async function analyzeCompetitors(projectName: string, elevatorPitch: string) {
  const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
  
  if (!FIRECRAWL_API_KEY) {
    throw new Error('Firecrawl API key not configured');
  }
  
  try {
    // Search for competitors
    const competitorKeywords = extractKeywords(elevatorPitch);
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(competitorKeywords.join(' ') + ' competitors alternatives')}`;
    
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: searchUrl,
        formats: ['markdown'],
        onlyMainContent: true
      })
    });
    
    if (!response.ok) {
      throw new Error(`Firecrawl API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      directCompetitors: extractCompetitors(data.data?.markdown || ''),
      priceComparison: extractPricing(data.data?.markdown || ''),
      featureGaps: identifyFeatureGaps(data.data?.markdown || '', elevatorPitch),
      positioning: suggestPositioning(data.data?.markdown || '', projectName)
    };
    
  } catch (error) {
    console.error('Firecrawl analysis failed:', error);
    return {
      directCompetitors: ['Competitor analysis temporarily unavailable'],
      priceComparison: 'Pricing data unavailable',
      featureGaps: ['Unable to analyze feature gaps'],
      positioning: 'Positioning analysis unavailable'
    };
  }
}

async function analyzeTrends(projectName: string, targetAudience: string) {
  // Use Tavily for trend analysis
  const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
  
  if (!TAVILY_API_KEY) {
    return {
      growingTrends: ['Trend analysis unavailable'],
      decliningTrends: ['Trend analysis unavailable'],
      emergingOpportunities: ['Trend analysis unavailable']
    };
  }
  
  try {
    const trendQuery = `${projectName} ${targetAudience} trending 2024 market demand`;
    
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TAVILY_API_KEY}`
      },
      body: JSON.stringify({
        query: trendQuery,
        search_depth: 'basic',
        include_answer: true,
        max_results: 5
      })
    });
    
    if (!response.ok) {
      throw new Error(`Tavily trend analysis error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      growingTrends: extractGrowingTrends(data.results),
      decliningTrends: extractDecliningTrends(data.results),
      emergingOpportunities: extractEmergingOpportunities(data.results)
    };
    
  } catch (error) {
    console.error('Trend analysis failed:', error);
    return {
      growingTrends: ['Trend analysis temporarily unavailable'],
      decliningTrends: ['Trend analysis temporarily unavailable'],
      emergingOpportunities: ['Trend analysis temporarily unavailable']
    };
  }
}

// Helper functions for data extraction
function extractMarketSize(answer: string): string {
  const sizePattern = /(\$[\d,]+\s*(billion|million|thousand))|(\d+\s*(billion|million|thousand)\s*\$)/i;
  const match = answer?.match(sizePattern);
  return match ? match[0] : 'Market size data not found';
}

function extractTrends(results: any[]): string[] {
  return results.slice(0, 3).map(r => r.title || 'Trend data unavailable');
}

function extractOpportunities(results: any[]): string[] {
  return results
    .filter(r => r.content?.includes('opportunity') || r.content?.includes('growing'))
    .slice(0, 3)
    .map(r => r.title || 'Opportunity data unavailable');
}

function extractThreats(results: any[]): string[] {
  return results
    .filter(r => r.content?.includes('challenge') || r.content?.includes('threat'))
    .slice(0, 3)
    .map(r => r.title || 'Threat data unavailable');
}

function extractKeywords(elevatorPitch: string): string[] {
  const words = elevatorPitch.toLowerCase().split(/\s+/);
  return words.filter(word => word.length > 4 && !['that', 'this', 'with', 'from', 'they', 'have', 'will', 'their', 'would', 'there', 'could', 'other'].includes(word));
}

function extractCompetitors(markdown: string): string[] {
  // Basic competitor extraction from markdown
  const competitorPattern = /(?:competitor|alternative|similar to|like)\s+([A-Z][a-z]+)/gi;
  const matches = markdown.match(competitorPattern);
  return matches?.slice(0, 5) || ['No competitors found'];
}

function extractPricing(markdown: string): string {
  const pricePattern = /\$[\d,]+(?:\.\d{2})?(?:\s*\/\s*\w+)?/g;
  const prices = markdown.match(pricePattern);
  return prices ? `Price range: ${prices.slice(0, 3).join(', ')}` : 'No pricing data found';
}

function identifyFeatureGaps(markdown: string, elevatorPitch: string): string[] {
  return ['AI-powered analysis', 'Real-time insights', 'Automated recommendations'];
}

function suggestPositioning(markdown: string, projectName: string): string {
  return `${projectName} should position itself as the most comprehensive and AI-driven solution in the market`;
}

function extractGrowingTrends(results: any[]): string[] {
  return results
    .filter(r => r.content?.includes('growing') || r.content?.includes('increasing'))
    .slice(0, 3)
    .map(r => r.title || 'Growing trend data unavailable');
}

function extractDecliningTrends(results: any[]): string[] {
  return results
    .filter(r => r.content?.includes('declining') || r.content?.includes('decreasing'))
    .slice(0, 2)
    .map(r => r.title || 'Declining trend data unavailable');
}

function extractEmergingOpportunities(results: any[]): string[] {
  return results
    .filter(r => r.content?.includes('emerging') || r.content?.includes('new'))
    .slice(0, 3)
    .map(r => r.title || 'Emerging opportunity data unavailable');
}

function generateInsights(marketResearch: any, competitorAnalysis: any, trendAnalysis: any) {
  return {
    marketViabilityScore: calculateViabilityScore(marketResearch, competitorAnalysis),
    recommendedStrategy: 'Focus on AI-powered differentiation and real-time market intelligence',
    keyRisks: ['Market saturation', 'Competitive pressure', 'Technology changes'],
    successFactors: ['Unique value proposition', 'Strong market timing', 'Effective execution']
  };
}

function calculateViabilityScore(marketResearch: any, competitorAnalysis: any): number {
  // Simple scoring algorithm
  let score = 70; // Base score
  
  if (marketResearch.marketSize !== 'Market research temporarily unavailable') {
    score += 10;
  }
  
  if (marketResearch.opportunities.length > 0) {
    score += 10;
  }
  
  if (competitorAnalysis.directCompetitors.length < 5) {
    score += 10;
  }
  
  return Math.min(score, 100);
} 