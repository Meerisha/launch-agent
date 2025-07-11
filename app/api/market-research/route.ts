import { NextRequest, NextResponse } from 'next/server';
import { tavily } from '@tavily/core';
import OpenAI from 'openai';
import { 
  getCachedMarketResearch, 
  cacheMarketResearch,
  getCachedCompetitorAnalysis,
  cacheCompetitorAnalysis,
  getCachedTrendAnalysis,
  cacheTrendAnalysis 
} from '../../../lib/redis';

// Initialize clients
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { projectName, targetAudience, elevatorPitch } = await request.json();
    
    if (!projectName || !targetAudience || !elevatorPitch) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check cache first (Redis caching for 24 hours)
    const [cachedMarketResearch, cachedCompetitorAnalysis, cachedTrendAnalysis] = await Promise.all([
      getCachedMarketResearch(projectName),
      getCachedCompetitorAnalysis(projectName),
      getCachedTrendAnalysis(projectName)
    ]);

    // If all data is cached, return it
    if (cachedMarketResearch && cachedCompetitorAnalysis && cachedTrendAnalysis) {
      console.log('✅ Serving cached market research data for:', projectName);
      return NextResponse.json({
        success: true,
        marketResearch: cachedMarketResearch,
        competitorAnalysis: cachedCompetitorAnalysis,
        trendAnalysis: cachedTrendAnalysis,
        generatedAt: new Date().toISOString(),
        cached: true
      });
    }

    // Step 1: Market research with Tavily (use cache if available)
    const marketResearch = cachedMarketResearch || await searchMarketIntelligence(projectName, targetAudience);
    if (!cachedMarketResearch) {
      await cacheMarketResearch(projectName, marketResearch);
    }
    
    // Step 2: Competitive analysis with Tavily (use cache if available)
    const competitorAnalysis = cachedCompetitorAnalysis || await analyzeCompetitors(projectName, elevatorPitch);
    if (!cachedCompetitorAnalysis) {
      await cacheCompetitorAnalysis(projectName, competitorAnalysis);
    }
    
    // Step 3: Trend analysis (use cache if available)
    const trendAnalysis = cachedTrendAnalysis || await analyzeTrends(projectName, targetAudience);
    if (!cachedTrendAnalysis) {
      await cacheTrendAnalysis(projectName, trendAnalysis);
    }
    
    return NextResponse.json({
      success: true,
      marketResearch,
      competitorAnalysis,
      trendAnalysis,
      generatedAt: new Date().toISOString(),
      cached: false
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
  try {
    const searchQuery = `${projectName} market size trends analysis ${targetAudience} 2024`;
    
    const response = await tvly.search(searchQuery, {
      search_depth: 'advanced',
      max_results: 8,
      include_answer: true,
      include_domains: ['statista.com', 'marketresearch.com', 'grandviewresearch.com', 'ibisworld.com']
    });

    // Use OpenAI to analyze and summarize the findings
    const analysis = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a market research analyst. Analyze the provided search results and create a comprehensive market intelligence report focusing on market size, growth rate, key trends, and opportunities.'
        },
        {
          role: 'user',
          content: `Project: ${projectName}
Target Audience: ${targetAudience}

Search Results:
${response.results.map(r => `${r.title}: ${r.content}`).join('\n\n')}

Provide a structured market intelligence summary with:
1. Market size and growth projections
2. Key trends affecting this market
3. Target audience insights
4. Market opportunities and challenges`
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    });

    return {
      marketSize: extractMarketSize(response.results),
      growthRate: extractGrowthRate(response.results),
      trends: analysis.choices[0].message.content,
      opportunities: extractOpportunities(response.results),
      sources: response.results.map(r => ({ title: r.title, url: r.url }))
    };
  } catch (error) {
    console.error('Market intelligence search error:', error);
    return {
      marketSize: 'Market size data unavailable',
      growthRate: 'Growth rate data unavailable', 
      trends: 'Market trends analysis unavailable',
      opportunities: 'Market opportunities analysis unavailable',
      sources: []
    };
  }
}

async function analyzeCompetitors(projectName: string, elevatorPitch: string) {
  try {
    const searchQuery = `"${projectName}" competitors alternative similar products pricing features`;
    
    const response = await tvly.search(searchQuery, {
      search_depth: 'advanced',
      max_results: 10,
      include_answer: true,
      exclude_domains: ['wikipedia.org', 'reddit.com']
    });

    const analysis = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a competitive intelligence analyst. Analyze competitors and provide strategic insights for market positioning.'
        },
        {
          role: 'user',
          content: `Project: ${projectName}
Elevator Pitch: ${elevatorPitch}

Competitor Search Results:
${response.results.map(r => `${r.title}: ${r.content}`).join('\n\n')}

Provide competitive analysis with:
1. Key competitors identified
2. Pricing strategies observed
3. Feature gaps and opportunities
4. Market positioning recommendations`
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    });

    return {
      competitors: extractCompetitors(response.results),
      pricingAnalysis: extractPricing(response.results),
      featureGaps: analysis.choices[0].message.content,
      positioningAdvice: extractPositioning(response.results),
      sources: response.results.map(r => ({ title: r.title, url: r.url }))
    };
  } catch (error) {
    console.error('Competitor analysis error:', error);
    return {
      competitors: 'Competitor data unavailable',
      pricingAnalysis: 'Pricing analysis unavailable',
      featureGaps: 'Feature gap analysis unavailable',
      positioningAdvice: 'Positioning advice unavailable',
      sources: []
    };
  }
}

async function analyzeTrends(projectName: string, targetAudience: string) {
  try {
    const searchQuery = `${projectName} industry trends 2024 2025 ${targetAudience} emerging technology`;
    
    const response = await tvly.search(searchQuery, {
      search_depth: 'advanced',
      max_results: 6,
      include_answer: true,
      topic: 'general'
    });

    const analysis = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a trend analyst. Identify and analyze emerging trends relevant to the project and target audience.'
        },
        {
          role: 'user',
          content: `Project: ${projectName}
Target Audience: ${targetAudience}

Trend Search Results:
${response.results.map(r => `${r.title}: ${r.content}`).join('\n\n')}

Provide trend analysis with:
1. Key emerging trends
2. Technology developments
3. Consumer behavior shifts
4. Future opportunities`
        }
      ],
      max_tokens: 800,
      temperature: 0.4
    });

    return {
      emergingTrends: extractTrends(response.results),
      technologyDevelopments: extractTech(response.results),
      consumerBehavior: analysis.choices[0].message.content,
      futureOpportunities: extractFutureOps(response.results),
      sources: response.results.map(r => ({ title: r.title, url: r.url }))
    };
  } catch (error) {
    console.error('Trend analysis error:', error);
    return {
      emergingTrends: 'Trend data unavailable',
      technologyDevelopments: 'Technology analysis unavailable',
      consumerBehavior: 'Consumer behavior analysis unavailable',
      futureOpportunities: 'Future opportunities unavailable',
      sources: []
    };
  }
}

// Helper functions to extract specific data from search results
function extractMarketSize(results: any[]): string {
  const sizeKeywords = ['market size', 'billion', 'million', 'revenue', 'valued at'];
  const relevantContent = results.find(r => 
    sizeKeywords.some(keyword => r.content.toLowerCase().includes(keyword))
  );
  return relevantContent?.content.slice(0, 200) + '...' || 'Market size data not found';
}

function extractGrowthRate(results: any[]): string {
  const growthKeywords = ['growth rate', 'CAGR', 'compound annual', 'growing at', 'expected to grow'];
  const relevantContent = results.find(r => 
    growthKeywords.some(keyword => r.content.toLowerCase().includes(keyword))
  );
  return relevantContent?.content.slice(0, 200) + '...' || 'Growth rate data not found';
}

function extractOpportunities(results: any[]): string {
  const opportunityKeywords = ['opportunity', 'potential', 'emerging', 'demand', 'need'];
  const relevantContent = results.find(r => 
    opportunityKeywords.some(keyword => r.content.toLowerCase().includes(keyword))
  );
  return relevantContent?.content.slice(0, 200) + '...' || 'Opportunities data not found';
}

function extractCompetitors(results: any[]): string {
  const competitorKeywords = ['competitor', 'alternative', 'similar', 'rival', 'versus'];
  const relevantContent = results.find(r => 
    competitorKeywords.some(keyword => r.content.toLowerCase().includes(keyword))
  );
  return relevantContent?.content.slice(0, 200) + '...' || 'Competitor data not found';
}

function extractPricing(results: any[]): string {
  const pricingKeywords = ['price', 'cost', 'pricing', 'subscription', 'fee', '$'];
  const relevantContent = results.find(r => 
    pricingKeywords.some(keyword => r.content.toLowerCase().includes(keyword))
  );
  return relevantContent?.content.slice(0, 200) + '...' || 'Pricing data not found';
}

function extractPositioning(results: any[]): string {
  const positioningKeywords = ['position', 'differentiate', 'unique', 'advantage', 'benefit'];
  const relevantContent = results.find(r => 
    positioningKeywords.some(keyword => r.content.toLowerCase().includes(keyword))
  );
  return relevantContent?.content.slice(0, 200) + '...' || 'Positioning data not found';
}

function extractTrends(results: any[]): string {
  const trendKeywords = ['trend', 'emerging', 'future', 'innovation', 'development'];
  const relevantContent = results.find(r => 
    trendKeywords.some(keyword => r.content.toLowerCase().includes(keyword))
  );
  return relevantContent?.content.slice(0, 200) + '...' || 'Trend data not found';
}

function extractTech(results: any[]): string {
  const techKeywords = ['technology', 'AI', 'machine learning', 'automation', 'digital'];
  const relevantContent = results.find(r => 
    techKeywords.some(keyword => r.content.toLowerCase().includes(keyword))
  );
  return relevantContent?.content.slice(0, 200) + '...' || 'Technology data not found';
}

function extractFutureOps(results: any[]): string {
  const futureKeywords = ['future', 'opportunity', 'potential', 'next', 'upcoming'];
  const relevantContent = results.find(r => 
    futureKeywords.some(keyword => r.content.toLowerCase().includes(keyword))
  );
  return relevantContent?.content.slice(0, 200) + '...' || 'Future opportunities data not found';
} 