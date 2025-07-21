import { storeKnowledgeDocument, KnowledgeDocument } from './rag';

/**
 * Seed the knowledge base with initial business and launch strategy content
 */
export async function seedKnowledgeBase(): Promise<void> {
  console.log('🌱 Starting knowledge base seeding...');

  const documents: KnowledgeDocument[] = [
    // Launch Strategy Documents
    {
      title: "SaaS Launch Strategy Framework",
      content: `A comprehensive framework for launching SaaS products successfully. The framework consists of four phases: 1) Pre-launch validation (6-8 weeks): Validate product-market fit through customer interviews, build MVP, conduct beta testing with 20-50 users. 2) Soft launch (2-4 weeks): Limited release to early adopters, gather feedback, optimize onboarding flow, establish pricing strategy. 3) Public launch (1-2 weeks): Product Hunt launch, media outreach, content marketing campaign, influencer partnerships. 4) Post-launch growth (ongoing): Customer success focus, viral features implementation, scaling marketing channels, feature expansion based on user feedback. Key metrics to track: Monthly Recurring Revenue (MRR), Customer Acquisition Cost (CAC), Lifetime Value (LTV), churn rate, Net Promoter Score (NPS). Critical success factors include having strong product-market fit, clear value proposition, robust customer support, and scalable infrastructure.`,
      document_type: "launch_strategy",
      category: "saas",
      tags: ["saas", "launch", "strategy", "framework", "mvp", "metrics"],
      source: "Internal Research"
    },
    {
      title: "E-commerce Launch Playbook",
      content: `Complete playbook for launching e-commerce businesses. Phase 1: Market Research & Product Validation - Identify target market through surveys and competitor analysis, validate product demand using landing pages and pre-orders, source reliable suppliers and establish supply chain. Phase 2: Platform Setup - Choose platform (Shopify, WooCommerce, custom), design user-friendly website with mobile optimization, implement payment processing and security measures, set up inventory management system. Phase 3: Marketing Foundation - Develop brand identity and messaging, create content marketing strategy, establish social media presence, implement SEO best practices. Phase 4: Launch Execution - Soft launch to friends and family, gather feedback and optimize, public launch with promotional campaign, influencer partnerships and PR outreach. Key metrics: Conversion rate, Average Order Value (AOV), Customer Acquisition Cost (CAC), Return on Ad Spend (ROAS), Customer Lifetime Value (CLV). Post-launch focus on customer retention, review management, and scaling profitable marketing channels.`,
      document_type: "launch_strategy",
      category: "ecommerce",
      tags: ["ecommerce", "launch", "shopify", "marketing", "conversion", "aov"],
      source: "E-commerce Best Practices"
    },
    {
      title: "Consulting Business Launch Guide",
      content: `Strategic guide for launching a successful consulting business. Foundation Phase: Define your niche and unique value proposition, identify target client profile and pain points, develop service packages and pricing strategy, establish professional credentials and thought leadership. Business Setup: Choose business structure (LLC, Corporation), set up business banking and accounting systems, create professional website and portfolio, develop client contracts and proposals templates. Marketing & Sales: Build LinkedIn presence and thought leadership content, attend industry events and networking, develop referral partner relationships, create case studies and testimonials. Service delivery: Establish project management processes, develop proprietary methodologies and frameworks, create client onboarding and communication systems, implement feedback and improvement loops. Scaling: Hire additional consultants or contractors, develop training and knowledge transfer systems, create passive income streams (courses, templates), expand into adjacent markets or services. Key success factors include deep expertise, strong network, excellent communication skills, and consistent delivery of measurable results.`,
      document_type: "launch_strategy",
      category: "consulting",
      tags: ["consulting", "services", "thought-leadership", "networking", "scaling"],
      source: "Consulting Industry Research"
    },
    // Industry Insights
    {
      title: "2024 SaaS Market Trends and Opportunities",
      content: `The SaaS market is experiencing unprecedented growth with global revenue projected to reach $716 billion by 2028. Key trends shaping the industry: 1) AI-First Products - 73% of SaaS companies are integrating AI features, with AI-powered analytics and automation driving 40% higher user engagement. 2) Vertical SaaS Dominance - Industry-specific solutions are outperforming horizontal platforms, with vertical SaaS companies achieving 25% higher retention rates. 3) Product-Led Growth (PLG) - 58% of SaaS unicorns use PLG strategies, resulting in 30% lower customer acquisition costs. 4) Micro-SaaS Opportunities - Solo entrepreneurs building niche SaaS tools, with many achieving $10K+ MRR within 12 months. 5) API-First Architecture - Companies building platforms that integrate seamlessly with existing workflows see 45% faster adoption. Emerging opportunities include workflow automation tools, industry-specific AI solutions, and integration platforms. Challenges include increased competition, rising customer acquisition costs, and the need for stronger product differentiation.`,
      document_type: "industry_insight",
      category: "saas",
      tags: ["saas", "trends", "ai", "plg", "micro-saas", "vertical"],
      source: "SaaS Industry Report 2024"
    },
    {
      title: "E-commerce Growth Drivers and Consumer Behavior",
      content: `E-commerce continues rapid expansion with global sales reaching $6.2 trillion in 2023. Consumer behavior shifts driving growth: 1) Mobile-First Shopping - 72% of consumers prefer mobile shopping apps, with mobile commerce accounting for 60% of total e-commerce sales. 2) Social Commerce - Instagram and TikTok shopping features drive 35% of Gen Z purchases, with live streaming sales growing 200% year-over-year. 3) Sustainability Focus - 67% of consumers willing to pay premium for sustainable products, creating opportunities for eco-friendly brands. 4) Personalization Expectations - AI-driven personalization increases conversion rates by 15-20%, with dynamic pricing and product recommendations becoming standard. 5) Omnichannel Experiences - Businesses with strong omnichannel strategies retain 89% of customers vs 33% for weak omnichannel. Growth opportunities in direct-to-consumer brands, niche marketplaces, subscription commerce, and cross-border e-commerce. Key success factors include fast shipping, easy returns, personalized experiences, and strong brand storytelling.`,
      document_type: "industry_insight",
      category: "ecommerce",
      tags: ["ecommerce", "mobile", "social-commerce", "personalization", "omnichannel"],
      source: "E-commerce Trends Report 2024"
    },
    // Market Research Methodologies
    {
      title: "Customer Interview Framework for Product Validation",
      content: `Systematic approach to conducting customer interviews for product validation. Preparation: Define interview objectives and key hypotheses to test, identify target customer segments and recruit 15-20 participants, prepare open-ended questions that avoid leading responses. Interview Structure: 1) Background (5 mins) - Understand customer context and current solutions, 2) Problem Exploration (15 mins) - Dive deep into pain points and current workflows, 3) Solution Discussion (10 mins) - Present concept and gather reactions, 4) Follow-up Questions (5 mins) - Clarify responses and explore edge cases. Key Questions: 'Tell me about the last time you encountered [problem]', 'What have you tried to solve this?', 'What would need to be true for you to switch to a new solution?', 'What concerns would you have about [proposed solution]?'. Analysis: Look for patterns across interviews, identify unmet needs and feature priorities, validate pricing assumptions and purchase intent, document personas and use cases. Common mistakes: Asking leading questions, talking more than listening, not probing deep enough into problems, overselling your solution during interviews.`,
      document_type: "framework",
      category: "general",
      tags: ["customer-interviews", "validation", "market-research", "personas"],
      source: "Product Management Best Practices"
    },
    {
      title: "Competitive Analysis Framework",
      content: `Comprehensive framework for analyzing competitors and market positioning. Phase 1: Competitor Identification - Direct competitors (same solution, same market), Indirect competitors (different solution, same problem), Substitute products (alternative ways to solve the problem), Emerging threats (new technologies or business models). Phase 2: Data Collection - Product features and pricing analysis, Marketing messaging and positioning, Customer reviews and feedback analysis, Financial performance and funding history, Team and hiring patterns. Phase 3: SWOT Analysis - Strengths (what they do well), Weaknesses (gaps and vulnerabilities), Opportunities (market trends they could leverage), Threats (challenges they face). Phase 4: Strategic Insights - Market gaps and opportunities, Pricing strategy implications, Feature differentiation opportunities, Marketing channel effectiveness, Partnership and acquisition targets. Tools: SEMrush for traffic analysis, Ahrefs for content strategy, SimilarWeb for audience insights, G2/Capterra for feature comparison. Update analysis quarterly or when major competitor moves occur.`,
      document_type: "framework",
      category: "general",
      tags: ["competitive-analysis", "market-research", "positioning", "swot"],
      source: "Strategic Analysis Framework"
    },
    // Best Practices
    {
      title: "Pricing Strategy Best Practices for SaaS",
      content: `Evidence-based pricing strategies for SaaS products. Value-Based Pricing: Price based on customer value rather than costs, conduct willingness-to-pay surveys with target customers, use Van Westendorp Price Sensitivity Meter for price range validation. Pricing Models: 1) Freemium - Free tier with paid upgrades, works best for high-volume, low-touch products, typical conversion rates 2-5%. 2) Tiered Pricing - Multiple plans with clear feature differentiation, most popular plan should capture majority of target market. 3) Usage-Based - Price scales with customer usage, aligns cost with value, popular for API and infrastructure products. Psychological Pricing: End prices in 9 or 7 for consumer products, use round numbers ($50, $100) for business products, anchor high with premium tier to make mid-tier seem reasonable. A/B Testing: Test price changes with 5-10% of traffic, measure long-term metrics (LTV, churn) not just conversion, run tests for full customer lifecycle (3-6 months minimum). Common mistakes: Underpricing to gain market share, too many pricing tiers causing confusion, not updating prices as value increases, ignoring competitor pricing completely.`,
      document_type: "best_practice",
      category: "saas",
      tags: ["pricing", "saas", "freemium", "value-based", "a-b-testing"],
      source: "SaaS Pricing Research"
    },
    {
      title: "Content Marketing Strategy for B2B Launches",
      content: `Strategic approach to content marketing for B2B product launches. Content Pillars: 1) Educational Content - How-to guides and tutorials that solve customer problems, Industry insights and trend analysis, Best practices and frameworks. 2) Thought Leadership - Executive viewpoints on industry challenges, Original research and data studies, Speaking opportunities and podcast appearances. 3) Product Content - Feature announcements and product demos, Customer success stories and case studies, Product updates and roadmap insights. Content Distribution: Blog and SEO-optimized articles for organic discovery, LinkedIn and Twitter for professional networking, Email newsletters for direct communication, YouTube and webinars for deeper engagement, Podcast guesting for authority building. Content Calendar: Plan 3-6 months in advance with key themes, Create evergreen content that remains relevant, Align content with product launch timeline, Repurpose content across multiple formats. Metrics: Organic traffic growth and keyword rankings, Social media engagement and follower growth, Email open rates and click-through rates, Lead generation and conversion rates, Brand awareness and share of voice. Success requires consistency, quality over quantity, and genuine value creation for your audience.`,
      document_type: "best_practice",
      category: "general",
      tags: ["content-marketing", "b2b", "thought-leadership", "seo", "lead-generation"],
      source: "B2B Marketing Best Practices"
    },
    // Case Studies
    {
      title: "Notion's Product-Led Growth Success Story",
      content: `How Notion grew from zero to $10 billion valuation through product-led growth. Background: Launched in 2016 as an all-in-one workspace tool competing against established players like Evernote and Microsoft OneNote. PLG Strategy: 1) Freemium Model - Generous free tier with no time limit, paid plans for teams and advanced features, free tier designed to create viral adoption. 2) User-Generated Content - Templates created by community became growth engine, users sharing workspaces and setups on social media, organic word-of-mouth through productivity communities. 3) Product Virality - Collaboration features naturally invited team members, public pages showcased product capabilities, easy sharing and duplication of workspaces. Key Growth Tactics: Strong onboarding with interactive tutorials, active community building on Reddit and Discord, influencer partnerships with productivity YouTubers, continuous product iteration based on user feedback. Results: Grew from 1 million to 20 million users in 2 years, achieved $10 billion valuation with minimal paid marketing, 90%+ of growth came from organic channels. Lessons: Product quality and user experience drive sustainable growth, community-driven content creation scales naturally, freemium works when free tier provides real value.`,
      document_type: "case_study",
      category: "saas",
      tags: ["notion", "plg", "freemium", "viral-growth", "community"],
      source: "Growth Case Study Analysis"
    },
    {
      title: "Warby Parker's D2C Disruption Strategy",
      content: `How Warby Parker disrupted the eyewear industry with direct-to-consumer strategy. Challenge: Traditional eyewear industry dominated by Luxottica monopoly with high prices ($300+ for basic frames), limited selection and poor customer experience. Strategy: 1) Vertical Integration - Designed and manufactured own frames, eliminated middleman markups, offered designer-quality glasses at $95 price point. 2) Home Try-On Program - Revolutionary 5-frame home trial program, reduced purchase friction and uncertainty, created shareable social media moments. 3) Brand Building - Strong brand story about founders' frustration with expensive glasses, social mission to donate glasses to those in need, authentic and relatable marketing messaging. 4) Omnichannel Approach - Started online-only but added physical showrooms, seamless integration between online and offline experience, used data to optimize store locations. Results: Reached $100M revenue in 5 years, achieved unicorn status with $1.2B valuation, expanded to contacts and eye exams, inspired entire D2C movement. Key Lessons: Challenge industry assumptions about pricing and distribution, create differentiated customer experience, build authentic brand story that resonates, test online before investing in physical retail.`,
      document_type: "case_study",
      category: "ecommerce",
      tags: ["warby-parker", "d2c", "disruption", "home-try-on", "omnichannel"],
      source: "D2C Success Stories"
    },
    // Financial Frameworks
    {
      title: "SaaS Unit Economics and Key Metrics",
      content: `Essential financial metrics and unit economics for SaaS businesses. Core Metrics: 1) Monthly Recurring Revenue (MRR) - Predictable monthly revenue from subscriptions, New MRR + Expansion MRR - Churned MRR - Contraction MRR. 2) Customer Acquisition Cost (CAC) - Total sales and marketing spend divided by new customers acquired, should be calculated with time lag to account for sales cycles. 3) Lifetime Value (LTV) - Average revenue per customer divided by churn rate, simple formula: (Average Monthly Revenue per Customer / Monthly Churn Rate). 4) LTV/CAC Ratio - Should be 3:1 or higher for healthy unit economics, 5:1+ indicates very strong business model. Advanced Metrics: CAC Payback Period (how long to recover acquisition cost), Net Revenue Retention (expansion revenue from existing customers), Gross Revenue Retention (revenue retention excluding expansion), Annual Contract Value (ACV) for enterprise businesses. Cohort Analysis: Track customer behavior over time by signup month, measure retention, expansion, and lifetime value by cohort, identify trends and seasonality patterns. Benchmarks: Best-in-class SaaS companies achieve 5-7% monthly churn, 110%+ net revenue retention, less than 12 months CAC payback period.`,
      document_type: "framework",
      category: "saas",
      tags: ["unit-economics", "saas-metrics", "ltv", "cac", "mrr", "cohort-analysis"],
      source: "SaaS Financial Analysis"
    },
    {
      title: "E-commerce Financial Planning and Cash Flow",
      content: `Financial planning framework for e-commerce businesses. Revenue Planning: Forecast based on traffic, conversion rate, and average order value, account for seasonality and promotional periods, plan for different customer segments and product categories. Cost Structure: Cost of Goods Sold (COGS) typically 30-60% of revenue, shipping and fulfillment costs 5-15% of revenue, payment processing fees 2-3% of revenue, customer acquisition costs 10-30% of revenue. Cash Flow Management: Inventory investment requires significant upfront capital, 30-60 day payment terms from suppliers, seasonal inventory buildup for peak periods, plan for 3-6 months of operating expenses as cash buffer. Key Metrics: Gross Margin (Revenue - COGS) / Revenue, Contribution Margin includes variable costs like shipping, Customer Lifetime Value based on repeat purchase behavior, Inventory Turnover (COGS / Average Inventory). Working Capital: Accounts Receivable (for B2B) + Inventory - Accounts Payable, optimize payment terms with suppliers and customers, use inventory forecasting to minimize carrying costs. Growth Investment: Balance growth spending with profitability, reinvest 70-80% of profits in peak season, focus on lifetime value optimization over short-term profits.`,
      document_type: "framework",
      category: "ecommerce",
      tags: ["financial-planning", "cash-flow", "inventory", "margins", "working-capital"],
      source: "E-commerce Financial Management"
    }
  ];

  console.log(`📚 Seeding ${documents.length} knowledge documents...`);

  let successCount = 0;
  let errorCount = 0;

  for (const document of documents) {
    try {
      await storeKnowledgeDocument(document);
      successCount++;
      console.log(`✅ Stored: ${document.title}`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Failed to store: ${document.title}`, error);
    }
  }

  console.log(`🌱 Knowledge base seeding completed!`);
  console.log(`✅ Successfully stored: ${successCount} documents`);
  console.log(`❌ Failed to store: ${errorCount} documents`);
}

/**
 * Add additional domain-specific knowledge based on user needs
 */
export async function addDomainKnowledge(domain: string): Promise<void> {
  const additionalDocs: Record<string, KnowledgeDocument[]> = {
    fintech: [
      {
        title: "Fintech Regulatory Compliance Framework",
        content: "Comprehensive guide to financial regulations including PCI DSS compliance, KYC/AML requirements, data privacy laws (GDPR, CCPA), banking partnerships and licensing requirements. Key considerations for payment processing, lending, investment platforms, and cryptocurrency businesses.",
        document_type: "framework",
        category: "fintech",
        tags: ["fintech", "compliance", "regulations", "kyc", "pci-dss"],
        source: "Fintech Compliance Guide"
      }
    ],
    healthtech: [
      {
        title: "Healthcare Technology HIPAA Compliance",
        content: "Essential HIPAA compliance requirements for health technology products including technical safeguards, administrative safeguards, physical safeguards, business associate agreements, breach notification procedures, and audit requirements.",
        document_type: "framework",
        category: "healthtech",
        tags: ["healthtech", "hipaa", "compliance", "privacy", "security"],
        source: "Healthcare Compliance Guide"
      }
    ]
  };

  const docs = additionalDocs[domain];
  if (docs) {
    console.log(`📚 Adding ${docs.length} ${domain} knowledge documents...`);
    for (const doc of docs) {
      try {
        await storeKnowledgeDocument(doc);
        console.log(`✅ Added: ${doc.title}`);
      } catch (error) {
        console.error(`❌ Failed to add: ${doc.title}`, error);
      }
    }
  }
} 