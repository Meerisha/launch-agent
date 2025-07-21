import { NextRequest, NextResponse } from 'next/server'
import { competitiveIntelligence } from '../../../tools'
import { z } from 'zod'

// Input validation schema
const CompetitiveIntelligenceInputSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  industry: z.string().min(1, 'Industry is required'),
  region: z.string().default('US'),
  analysisDepth: z.enum(['basic', 'detailed', 'comprehensive']).default('detailed'),
  includeFinancing: z.boolean().default(true),
  includeTrends: z.boolean().default(true),
  includeCompetitors: z.boolean().default(true)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedInput = CompetitiveIntelligenceInputSchema.parse(body)
    
    console.log(`🔍 Starting competitive intelligence API analysis for ${validatedInput.companyName}`)
    
    // Call the competitive intelligence tool
    const result = await competitiveIntelligence.handler(validatedInput)
    
    return NextResponse.json({
      success: true,
      data: result,
      message: `Competitive intelligence analysis completed for ${validatedInput.companyName}`
    })
    
  } catch (error) {
    console.error('Competitive Intelligence API Error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid input data', 
          details: error.errors,
          success: false 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        success: false 
      },
      { status: 500 }
    )
  }
}

// Handle GET requests for documentation
export async function GET() {
  return NextResponse.json({
    name: 'Competitive Intelligence API',
    description: 'Comprehensive competitive intelligence automation with real-time market data, competitor analysis, and funding landscape insights',
    methods: ['POST'],
    endpoint: '/api/competitive-intelligence',
    parameters: {
      companyName: 'string (required) - Name of the company to analyze',
      industry: 'string (required) - Industry sector',
      region: 'string (optional) - Geographic region (default: US)',
      analysisDepth: 'enum (optional) - basic | detailed | comprehensive (default: detailed)',
      includeFinancing: 'boolean (optional) - Include funding landscape analysis (default: true)',
      includeTrends: 'boolean (optional) - Include market trends analysis (default: true)',
      includeCompetitors: 'boolean (optional) - Include competitor analysis (default: true)'
    },
    example: {
      companyName: 'TechStartup',
      industry: 'fintech',
      region: 'US',
      analysisDepth: 'detailed',
      includeFinancing: true,
      includeTrends: true,
      includeCompetitors: true
    },
    features: [
      'Real-time Google Trends integration',
      'Web scraping for competitor data',
      'Funding landscape analysis with Tavily',
      'Market opportunity identification',
      'Strategic recommendations',
      'Redis caching for performance'
    ]
  })
} 