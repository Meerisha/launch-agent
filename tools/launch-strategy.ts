import { z } from "zod";

const LaunchStrategySchema = z.object({
  projectType: z.enum(["course", "saas", "consulting", "physical-product", "digital-product"]).describe("Type of product being launched"),
  budget: z.number().min(0).describe("Available marketing budget in USD"),
  timeframe: z.number().min(1).max(52).describe("Weeks until launch"),
  audienceSize: z.number().min(0).describe("Current audience/email list size"),
  revenueGoal: z.number().min(100).describe("Revenue goal in USD"),
  channels: z.array(z.string()).describe("Available marketing channels")
});

export const launchStrategyTool = {
  name: "generate_launch_strategy",
  description: "Generate comprehensive launch strategy with tactics, timeline, and budget allocation",
  inputSchema: LaunchStrategySchema,
  handler: async (input: z.infer<typeof LaunchStrategySchema>) => {
    const strategy = generateStrategy(input);
    return {
      strategy: strategy,
      timeline: generateLaunchTimeline(input),
      budgetAllocation: allocateBudget(input),
      successMetrics: defineSuccessMetrics(input)
    };
  },
};

function generateStrategy(input: z.infer<typeof LaunchStrategySchema>) {
  const { projectType, audienceSize, budget, timeframe } = input;
  
  return {
    launchType: determineLaunchType(projectType, audienceSize),
    coreStrategy: getCoreStrategy(projectType, budget, timeframe),
    channels: prioritizeChannels(input.channels, projectType, budget),
    contentStrategy: getContentStrategy(projectType, timeframe),
    partnerships: getPartnershipStrategy(projectType, audienceSize)
  };
}

function determineLaunchType(projectType: string, audienceSize: number) {
  if (audienceSize > 10000) return "Audience Launch";
  if (audienceSize > 1000) return "Community Launch"; 
  if (projectType === "saas") return "Product Hunt Launch";
  return "Stealth Launch";
}

function getCoreStrategy(projectType: string, budget: number, timeframe: number) {
  const strategies = {
    course: {
      prelaunch: "Build authority through free content and email list",
      launch: "Beta cohort with early bird pricing",
      postlaunch: "Testimonials and referral program"
    },
    saas: {
      prelaunch: "Problem validation and waitlist building",
      launch: "Freemium model with Product Hunt launch",
      postlaunch: "User feedback iteration and scaling"
    },
    consulting: {
      prelaunch: "Case studies and thought leadership content",
      launch: "Limited spots with premium pricing",
      postlaunch: "Client success stories and expansion"
    },
    "physical-product": {
      prelaunch: "Pre-orders and influencer partnerships", 
      launch: "Inventory management and fulfillment",
      postlaunch: "Reviews and repeat customers"
    },
    "digital-product": {
      prelaunch: "Content marketing and lead magnets",
      launch: "Launch sequence with scarcity",
      postlaunch: "Upsells and affiliate program"
    }
  };
  
  return strategies[projectType as keyof typeof strategies] || strategies["digital-product"];
}

function prioritizeChannels(channels: string[], projectType: string, budget: number) {
  const channelPriority = {
    course: ["email", "linkedin", "youtube", "webinars", "partnerships"],
    saas: ["content-marketing", "product-hunt", "linkedin", "twitter", "paid-ads"],
    consulting: ["linkedin", "speaking", "case-studies", "referrals", "content"],
    "physical-product": ["instagram", "tiktok", "influencers", "amazon", "paid-ads"],
    "digital-product": ["email", "content-marketing", "affiliates", "social-media", "paid-ads"]
  };
  
  const recommended = channelPriority[projectType as keyof typeof channelPriority] || [];
  const available = channels.map(c => c.toLowerCase());
  
  return recommended.filter(channel => 
    available.some(avail => avail.includes(channel) || channel.includes(avail))
  ).slice(0, budget > 5000 ? 5 : 3);
}

function getContentStrategy(projectType: string, timeframe: number) {
  const contentTypes = {
    course: ["educational posts", "case studies", "free mini-lessons", "student testimonials"],
    saas: ["problem-focused content", "solution demos", "behind-the-scenes", "feature announcements"],
    consulting: ["expertise demonstrations", "client results", "industry insights", "process explanations"],
    "physical-product": ["product demos", "lifestyle content", "user-generated content", "behind-the-scenes"],
    "digital-product": ["value-driven content", "sneak peeks", "transformation stories", "tutorials"]
  };
  
  const frequency = timeframe < 8 ? "Daily" : timeframe < 16 ? "3x/week" : "2x/week";
  
  return {
    contentTypes: contentTypes[projectType as keyof typeof contentTypes] || contentTypes["digital-product"],
    frequency: frequency,
    platforms: getPlatformStrategy(projectType),
    contentCalendar: generateContentCalendar(timeframe)
  };
}

function getPlatformStrategy(projectType: string) {
  const platforms = {
    course: ["LinkedIn", "YouTube", "Email"],
    saas: ["Twitter", "LinkedIn", "Product Hunt"],
    consulting: ["LinkedIn", "Industry Forums", "Speaking Events"],
    "physical-product": ["Instagram", "TikTok", "Pinterest"],
    "digital-product": ["Instagram", "Twitter", "Email"]
  };
  
  return platforms[projectType as keyof typeof platforms] || platforms["digital-product"];
}

function getPartnershipStrategy(projectType: string, audienceSize: number) {
  if (audienceSize > 5000) {
    return {
      type: "Cross-promotion partnerships",
      approach: "Audience swaps with complementary creators"
    };
  } else {
    return {
      type: "Affiliate partnerships",
      approach: "Revenue-share with established audiences"
    };
  }
}

function generateLaunchTimeline(input: z.infer<typeof LaunchStrategySchema>) {
  const { timeframe } = input;
  const phases = [];
  
  // Pre-launch (60% of time)
  const prelaunchWeeks = Math.ceil(timeframe * 0.6);
  phases.push({
    phase: "Pre-launch",
    duration: `${prelaunchWeeks} weeks`,
    activities: [
      "Content creation and audience building",
      "Email list growth and engagement",
      "Partnership outreach and agreements",
      "Beta testing and feedback collection"
    ]
  });
  
  // Launch week (1 week)
  phases.push({
    phase: "Launch Week",
    duration: "1 week",
    activities: [
      "Launch sequence emails",
      "Social media announcements",
      "Partner promotions",
      "PR and media outreach"
    ]
  });
  
  // Post-launch (remaining time)
  const postlaunchWeeks = timeframe - prelaunchWeeks - 1;
  if (postlaunchWeeks > 0) {
    phases.push({
      phase: "Post-launch",
      duration: `${postlaunchWeeks} weeks`,
      activities: [
        "Customer success and support",
        "Testimonial collection",
        "Optimization and iteration",
        "Scale and growth strategies"
      ]
    });
  }
  
  return phases;
}

function allocateBudget(input: z.infer<typeof LaunchStrategySchema>) {
  const { budget, projectType } = input;
  
  if (budget === 0) {
    return {
      total: 0,
      message: "Organic/bootstrap strategy - focus on content and partnerships",
      allocation: {}
    };
  }
  
  const allocations = {
    course: { content: 0.3, advertising: 0.4, tools: 0.2, partnerships: 0.1 },
    saas: { development: 0.2, advertising: 0.4, tools: 0.3, partnerships: 0.1 },
    consulting: { content: 0.4, networking: 0.3, tools: 0.2, advertising: 0.1 },
    "physical-product": { advertising: 0.5, inventory: 0.2, tools: 0.2, partnerships: 0.1 },
    "digital-product": { advertising: 0.4, content: 0.3, tools: 0.2, partnerships: 0.1 }
  };
  
  const allocation = allocations[projectType as keyof typeof allocations] || allocations["digital-product"];
  
  return {
    total: budget,
    allocation: Object.fromEntries(
      Object.entries(allocation).map(([key, percent]) => [
        key, 
        Math.round(budget * percent)
      ])
    )
  };
}

function defineSuccessMetrics(input: z.infer<typeof LaunchStrategySchema>) {
  const { revenueGoal, projectType } = input;
  
  return {
    primary: {
      revenue: revenueGoal,
      timeframe: "Launch period"
    },
    secondary: getSecondaryMetrics(projectType, revenueGoal),
    tracking: [
      "Daily revenue",
      "Conversion rates",
      "Customer acquisition cost",
      "Email open/click rates",
      "Social media engagement"
    ]
  };
}

function getSecondaryMetrics(projectType: string, revenueGoal: number) {
  const avgPricePoint = getAveragePrice(projectType);
  const targetCustomers = Math.ceil(revenueGoal / avgPricePoint);
  
  return {
    customers: targetCustomers,
    emailList: Math.ceil(targetCustomers * 10), // 10% conversion rate
    socialFollowers: Math.ceil(targetCustomers * 5),
    contentViews: Math.ceil(targetCustomers * 50)
  };
}

function getAveragePrice(projectType: string) {
  const averagePrices = {
    course: 297,
    saas: 49,
    consulting: 2500,
    "physical-product": 67,
    "digital-product": 97
  };
  
  return averagePrices[projectType as keyof typeof averagePrices] || 97;
}

function generateContentCalendar(timeframe: number) {
  const totalPosts = timeframe * 3; // Assuming 3 posts per week
  return {
    totalPosts: totalPosts,
    breakdown: {
      educational: Math.ceil(totalPosts * 0.4),
      promotional: Math.ceil(totalPosts * 0.2),
      social_proof: Math.ceil(totalPosts * 0.2),
      behind_scenes: Math.ceil(totalPosts * 0.2)
    }
  };
} 