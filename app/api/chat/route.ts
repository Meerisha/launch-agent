import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { projectIntakeTool } from '../../../tools/project-intake';
import { revenueCalculatorTool } from '../../../tools/revenue-calculator';
import { launchStrategyTool } from '../../../tools/launch-strategy';
import { competitiveIntelligence } from '../../../tools/competitive-intelligence';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory: ConversationMessage[];
  context: any;
}

interface ProjectContext {
  projectName?: string;
  elevatorPitch?: string;
  targetAudience?: string;
  launchGoal?: string;
  budget?: number;
  industry?: string;
  hasGeneratedAnalysis?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, context }: ChatRequest = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Extract project context from conversation
    const projectContext: ProjectContext = extractProjectContext(conversationHistory, context);
    
    // Check if user wants Instagram images - prioritize this
    const wantsInstagramImages = shouldGenerateInstagramImages(message) || 
      isInstagramFollowUp(message, conversationHistory);
    
    // Determine if user wants a full analysis or competitive intelligence
    const wantsAnalysis = shouldGenerateAnalysis(message, conversationHistory);
    const wantsCompetitiveIntelligence = shouldGenerateCompetitiveIntelligence(message);
    
    // Handle Instagram image generation with minimal questions
    if (wantsInstagramImages) {
      const instagramResult = await handleInstagramImageGeneration(message, projectContext, conversationHistory);
      if (instagramResult) {
        return NextResponse.json(instagramResult);
      }
    }
    
    // Create system prompt based on context
    const systemPrompt = createSystemPrompt(projectContext, wantsAnalysis, wantsCompetitiveIntelligence);
    
    // Get AI response
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-8), // Keep last 8 messages for context
        { role: 'user', content: message }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const aiResponse = response.choices[0].message.content || '';
    
    let analysisResult = null;
    let updatedContext = { ...projectContext };

    // If user wants full analysis and we have enough info, generate it
    if (wantsAnalysis && hasEnoughInfoForAnalysis(projectContext)) {
      try {
        analysisResult = await generateFullAnalysis(projectContext);
        updatedContext.hasGeneratedAnalysis = true;
      } catch (error) {
        console.error('Analysis generation error:', error);
      }
    }
    
    // If user wants competitive intelligence and we have enough info, generate it
    if (wantsCompetitiveIntelligence && hasEnoughInfoForCompetitiveIntelligence(projectContext)) {
      try {
        const competitiveIntelligenceResult = await generateCompetitiveIntelligence(projectContext);
        analysisResult = analysisResult ? 
          { ...analysisResult, competitiveIntelligence: competitiveIntelligenceResult } :
          { competitiveIntelligence: competitiveIntelligenceResult };
      } catch (error) {
        console.error('Competitive intelligence generation error:', error);
      }
    }

    // Update context with extracted information
    updatedContext = updateContextFromMessage(message, updatedContext);

    return NextResponse.json({
      response: aiResponse,
      context: updatedContext,
      analysis: analysisResult,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

function extractProjectContext(history: ConversationMessage[], existingContext: any): ProjectContext {
  const context: ProjectContext = { ...existingContext };
  
  // Look through conversation for key information
  const conversationText = history.map(m => m.content).join(' ').toLowerCase();
  
  // Extract project name patterns
  const projectPatterns = [
    /(?:project|app|product|business|startup|company) (?:called|named|is) ([^,.\n]+)/i,
    /(?:building|creating|developing|making) (?:a|an) ([^,.\n]+)/i,
    /(?:my|our) ([^,.\n]*(?:app|platform|service|tool|product|business))/i
  ];
  
  for (const pattern of projectPatterns) {
    const match = conversationText.match(pattern);
    if (match && !context.projectName) {
      context.projectName = match[1].trim();
      break;
    }
  }
  
  // Extract target audience
  const audiencePatterns = [
    /(?:target|for|audience|users|customers) (?:are|is) ([^,.\n]+)/i,
    /(?:helping|serving|targeting) ([^,.\n]+)/i
  ];
  
  for (const pattern of audiencePatterns) {
    const match = conversationText.match(pattern);
    if (match && !context.targetAudience) {
      context.targetAudience = match[1].trim();
      break;
    }
  }
  
  // Extract budget mentions
  const budgetPattern = /\$(\d+(?:,\d{3})*(?:\.\d{2})?)/;
  const budgetMatch = conversationText.match(budgetPattern);
  if (budgetMatch && !context.budget) {
    context.budget = parseInt(budgetMatch[1].replace(/,/g, ''));
  }
  
  // Extract industry mentions
  const industryPatterns = [
    /(?:in|for|within) the ([^,.\n]*(?:tech|fintech|healthtech|edtech|saas|ecommerce|retail|finance|health|education|ai|blockchain|crypto|gaming)) (?:industry|sector|market|space)/i,
    /(?:^|[^a-z])([^,.\n]*(?:tech|fintech|healthtech|edtech|saas|ecommerce|retail|finance|health|education|ai|blockchain|crypto|gaming)) (?:startup|company|business|platform|app)/i
  ];
  
  for (const pattern of industryPatterns) {
    const match = conversationText.match(pattern);
    if (match && !context.industry) {
      context.industry = match[1].trim();
      break;
    }
  }
  
  return context;
}

function shouldGenerateAnalysis(message: string, history: ConversationMessage[]): boolean {
  const analysisKeywords = [
    'analyze', 'analysis', 'complete analysis', 'full analysis',
    'revenue projections', 'launch strategy', 'market research',
    'business plan', 'feasibility', 'breakdown', 'detailed report',
    'competitive intelligence', 'competitor analysis', 'market intelligence',
    'competitors', 'competition', 'funding landscape'
  ];
  
  const messageText = message.toLowerCase();
  return analysisKeywords.some(keyword => messageText.includes(keyword));
}

function hasEnoughInfoForAnalysis(context: ProjectContext): boolean {
  return !!(context.projectName && (context.elevatorPitch || context.targetAudience));
}

function shouldGenerateCompetitiveIntelligence(message: string): boolean {
  const competitiveKeywords = [
    'competitive intelligence', 'competitor analysis', 'market intelligence',
    'competitors', 'competition', 'funding landscape', 'market trends',
    'competitor research', 'industry analysis'
  ];
  
  const messageText = message.toLowerCase();
  return competitiveKeywords.some(keyword => messageText.includes(keyword));
}

function hasEnoughInfoForCompetitiveIntelligence(context: ProjectContext): boolean {
  return !!(context.projectName && context.industry);
}

function createSystemPrompt(context: ProjectContext, wantsAnalysis: boolean, wantsCompetitiveIntelligence: boolean = false): string {
  let prompt = `You are LaunchPilot AI, an expert business launch consultant. You help entrepreneurs analyze their project ideas, create revenue projections, and develop launch strategies.

Key traits:
- Conversational and supportive
- Ask clarifying questions to gather project details
- Provide actionable insights and recommendations
- Focus on practical, implementable advice
- Use emojis sparingly for engagement

Current conversation context:`;

  if (context.projectName) {
    prompt += `\n- Project: ${context.projectName}`;
  }
  if (context.targetAudience) {
    prompt += `\n- Target Audience: ${context.targetAudience}`;
  }
  if (context.budget) {
    prompt += `\n- Budget: $${context.budget.toLocaleString()}`;
  }
  if (context.industry) {
    prompt += `\n- Industry: ${context.industry}`;
  }

  if (wantsCompetitiveIntelligence && hasEnoughInfoForCompetitiveIntelligence(context)) {
    prompt += `\n\nThe user wants competitive intelligence analysis. I will generate comprehensive competitor analysis, market trends, funding landscape, and strategic opportunities using advanced tools. Mention that you're generating competitive intelligence analysis and it will appear below the chat.`;
  } else if (wantsCompetitiveIntelligence) {
    prompt += `\n\nThe user wants competitive intelligence but I need more information. Ask for the missing details: project name and industry are required for competitive analysis.`;
  } else if (wantsAnalysis && hasEnoughInfoForAnalysis(context)) {
    prompt += `\n\nThe user wants a complete analysis. I will generate detailed project analysis, revenue projections, and launch strategy using the specialized tools available. Mention that you're generating a comprehensive analysis and it will appear below the chat.`;
  } else if (wantsAnalysis) {
    prompt += `\n\nThe user wants analysis but I need more information. Ask for the missing details needed for a complete analysis: project name/description and target audience are minimum requirements.`;
  } else {
    prompt += `\n\nHelp the user refine their project idea. Ask relevant follow-up questions about their target market, business model, competition, or implementation approach. If they seem ready for a full analysis or competitive intelligence, suggest it.`;
  }

  return prompt;
}

async function generateFullAnalysis(context: ProjectContext) {
  const projectData = {
    projectName: context.projectName || 'Unnamed Project',
    elevatorPitch: context.elevatorPitch || `A ${context.projectName} targeting ${context.targetAudience}`,
    targetAudience: context.targetAudience || 'General market',
    launchGoal: context.launchGoal || '$10k revenue in 60 days',
    creatorSkills: 'Solo founder',
    riskTolerance: 'medium' as const,
    existingAssets: 'none',
    constraints: 'none',
    launchWindow: 'ASAP'
  };

  // Step 1: Project Analysis
  const projectAnalysis = await projectIntakeTool.handler(projectData);

  // Step 2: Revenue Projections
  const revenueProjections = await revenueCalculatorTool.handler({
    productType: 'saas',
    pricePoint: 97,
    targetCustomers: 100,
    timeframe: 3
  });

  // Step 3: Launch Strategy
  const launchStrategy = await launchStrategyTool.handler({
    projectType: 'saas',
    budget: context.budget || 1000,
    timeframe: 8,
    audienceSize: 0,
    revenueGoal: 10000,
    channels: ['email', 'social', 'content']
  });

  return {
    projectName: context.projectName,
    analysis: {
      projectAnalysis,
      revenueProjections,
      launchStrategy
    },
    generatedAt: new Date().toISOString()
  };
}

async function generateCompetitiveIntelligence(context: ProjectContext) {
  const competitiveData = {
    companyName: context.projectName || 'Unnamed Project',
    industry: context.industry || 'tech',
    region: 'US',
    analysisDepth: 'detailed' as const,
    includeFinancing: true,
    includeTrends: true,
    includeCompetitors: true
  };

  // Generate competitive intelligence analysis
  const competitiveIntelligenceResult = await competitiveIntelligence.handler(competitiveData);

  return {
    companyName: context.projectName,
    industry: context.industry,
    analysis: competitiveIntelligenceResult,
    generatedAt: new Date().toISOString()
  };
}

function updateContextFromMessage(message: string, context: ProjectContext): ProjectContext {
  const updated = { ...context };
  
  // Extract new information from the current message
  if (!updated.elevatorPitch && message.length > 50) {
    // If message is substantial and we don't have elevator pitch, use it
    updated.elevatorPitch = message.substring(0, 200);
  }
  
  return updated;
}

// Instagram Image Generation Functions
function shouldGenerateInstagramImages(message: string): boolean {
  const instagramKeywords = [
    'instagram', 'insta', 'ig post', 'social media post', 'image', 'images', 
    'photo', 'photos', 'visual', 'graphics', 'generate image', 'create image',
    'post image', 'social image', 'feed image', 'content image'
  ];
  
  const lowerMessage = message.toLowerCase();
  return instagramKeywords.some(keyword => lowerMessage.includes(keyword));
}

function isInstagramFollowUp(message: string, conversationHistory: ConversationMessage[]): boolean {
  // Check if the last assistant message was asking for project name for Instagram images
  const lastAssistantMessage = conversationHistory
    .filter(msg => msg.role === 'assistant')
    .pop();
    
  if (lastAssistantMessage && 
      lastAssistantMessage.content.includes("Instagram images") && 
      lastAssistantMessage.content.includes("project/product name")) {
    
    // If user provided what looks like a project name (not a question), generate images
    const lowerMessage = message.toLowerCase();
    const isQuestion = lowerMessage.includes('?') || 
                      lowerMessage.startsWith('how') || 
                      lowerMessage.startsWith('what') || 
                      lowerMessage.startsWith('when') || 
                      lowerMessage.startsWith('why');
    
    return !isQuestion && message.trim().length > 2;
  }
  
  return false;
}

async function handleInstagramImageGeneration(
  message: string, 
  context: ProjectContext, 
  conversationHistory: ConversationMessage[]
): Promise<any | null> {
  // Extract Instagram-specific parameters from message and context
  let projectName = context.projectName || extractProjectNameFromMessage(message);
  
  // If we're in a follow-up conversation and message looks like a project name, use it directly
  if (!projectName && isInstagramFollowUp(message, conversationHistory)) {
    const trimmedMessage = message.trim();
    // If it's a short response that looks like a project name (not a sentence)
    if (trimmedMessage.length > 1 && trimmedMessage.length < 50 && !trimmedMessage.includes(' ')) {
      projectName = trimmedMessage;
    } else if (trimmedMessage.length < 100 && !trimmedMessage.includes('?')) {
      projectName = trimmedMessage;
    }
  }
  
  // Final fallback
  if (!projectName) {
    projectName = message.trim().length > 2 ? message.trim() : "My Project";
  }
  
  const targetAudience = context.targetAudience || "potential customers";
  
  // Determine content text from message
  let contentText = extractContentFromMessage(message);
  if (!contentText) {
    contentText = context.elevatorPitch || `Discover ${projectName} - innovative solution for modern users`;
  }
  
  // Only ask for project name if we really don't have any project info
  const hasProjectInfo = context.projectName || 
                        extractProjectNameFromMessage(message) || 
                        isInstagramFollowUp(message, conversationHistory) ||
                        (message.trim().length > 2 && !message.includes('?'));
  
  if (!hasProjectInfo) {
    return {
      response: "I'd love to create Instagram images for you! What's your project/product name so I can generate branded content?",
      context: context,
      analysis: null,
      generatedAt: new Date().toISOString()
    };
  }
  
  // Generate images directly with smart defaults
  try {
    const instagramParams = {
      projectName,
      postType: determinePostType(message),
      contentText,
      brandColors: extractBrandColors(message) || "modern blue and white",
      style: extractStyle(message) || "modern",
      targetAudience,
      includeText: true,
      aspectRatio: "square" as const
    };
    
    // Call the Instagram image generation tool directly
    const { instagramImageGeneratorTool } = await import('../../../tools/instagram-image-generator');
    const result = await instagramImageGeneratorTool.handler(instagramParams);
    
    return {
      response: `🎨 Perfect! I've generated professional Instagram images for ${projectName}! Here are your branded posts with captions, hashtags, and posting strategy.`,
      context: { ...context, projectName: projectName },
      analysis: {
        type: 'instagram_images',
        ...result
      },
      generatedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Instagram generation error:', error);
    return {
      response: "I'd love to help create Instagram images! Could you tell me a bit more about your project name and what message you want to convey?",
      context: context,
      analysis: null,
      generatedAt: new Date().toISOString()
    };
  }
}

function extractProjectNameFromMessage(message: string): string | null {
  // Look for patterns like "for my [project]", "my [project] app", "[project] business", etc.
  const patterns = [
    /(?:for my|my)\s+([^,.\s]+(?:\s+(?:app|business|startup|company|product|service|platform|tool))?)/i,
    /(?:called|named)\s+([^,.\s]+)/i,
    /([A-Z][a-zA-Z]+(?:App|AI|Pro|Plus|Hub|Lab|Fit|Track|Bot|Tech))/,
  ];
  
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return null;
}

function extractContentFromMessage(message: string): string | null {
  // Extract quoted content or descriptive text
  const quotedMatch = message.match(/["']([^"']{10,100})["']/);
  if (quotedMatch) return quotedMatch[1];
  
  // Look for descriptive phrases
  const descPatterns = [
    /(?:saying|message|text|content|about)[\s:]+([^,.!?]{15,100})/i,
    /(?:that says|with text)[\s:]+([^,.!?]{15,100})/i
  ];
  
  for (const pattern of descPatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return null;
}

function determinePostType(message: string): "product-showcase" | "behind-the-scenes" | "educational" | "testimonial" | "announcement" | "lifestyle" | "quote-post" {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('product') || lowerMessage.includes('showcase')) return 'product-showcase';
  if (lowerMessage.includes('behind') || lowerMessage.includes('team')) return 'behind-the-scenes';
  if (lowerMessage.includes('tip') || lowerMessage.includes('how to') || lowerMessage.includes('learn')) return 'educational';
  if (lowerMessage.includes('testimonial') || lowerMessage.includes('review')) return 'testimonial';
  if (lowerMessage.includes('announce') || lowerMessage.includes('launch')) return 'announcement';
  if (lowerMessage.includes('quote') || lowerMessage.includes('inspiration')) return 'quote-post';
  
  return 'lifestyle'; // Default to lifestyle
}

function extractBrandColors(message: string): string | null {
  const colorPattern = /(?:color[s]?|brand)[\s:]*([a-z]+(?:\s+and\s+[a-z]+)?(?:\s+[a-z]+)?)/i;
  const match = message.match(colorPattern);
  return match ? match[1] : null;
}

function extractStyle(message: string): "minimalist" | "modern" | "corporate" | "playful" | "elegant" | "tech" | "lifestyle" {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('minimal')) return 'minimalist';
  if (lowerMessage.includes('corporate') || lowerMessage.includes('business')) return 'corporate';
  if (lowerMessage.includes('fun') || lowerMessage.includes('playful')) return 'playful';
  if (lowerMessage.includes('elegant') || lowerMessage.includes('luxury')) return 'elegant';
  if (lowerMessage.includes('tech')) return 'tech';
  if (lowerMessage.includes('lifestyle')) return 'lifestyle';
  
  return 'modern'; // Default
} 