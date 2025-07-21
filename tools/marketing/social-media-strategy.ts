import { z } from "zod";

const SocialMediaStrategySchema = z.object({
  projectName: z.string().describe("Name of the project/product"),
  targetAudience: z.string().describe("Primary target audience demographics"),
  budget: z.number().optional().describe("Monthly social media budget in USD"),
  platforms: z.array(z.enum(["instagram", "twitter", "linkedin", "tiktok", "youtube", "facebook"])).describe("Preferred social media platforms"),
  contentTypes: z.array(z.enum(["educational", "behind-the-scenes", "user-generated", "promotional", "entertainment"])).describe("Types of content to create"),
  launchGoal: z.string().describe("Primary launch goal (followers, engagement, conversions)")
});

export const socialMediaStrategyTool = {
  name: "generate_social_media_strategy",
  description: "Create a comprehensive social media strategy for product launch with platform-specific recommendations",
  inputSchema: SocialMediaStrategySchema,
  handler: async (input: z.infer<typeof SocialMediaStrategySchema>) => {
    const strategy = generateSocialMediaStrategy(input);
    return {
      project: input.projectName,
      strategy: strategy,
      contentCalendar: generateContentCalendar(input),
      metrics: generateSocialMetrics(input),
      budget: generateBudgetBreakdown(input.budget || 500)
    };
  },
};

function generateSocialMediaStrategy(input: z.infer<typeof SocialMediaStrategySchema>) {
  const platformStrategies = input.platforms.map(platform => ({
    platform,
    strategy: getPlatformStrategy(platform, input.targetAudience),
    contentMix: getContentMix(platform, input.contentTypes),
    postingFrequency: getPostingFrequency(platform),
    bestTimes: getBestPostingTimes(platform)
  }));

  return {
    overview: `Social media strategy for ${input.projectName} targeting ${input.targetAudience}`,
    platformStrategies,
    crossPlatformApproach: getCrossPlatformApproach(input.platforms),
    engagementTactics: getEngagementTactics(input.targetAudience),
    influencerStrategy: getInfluencerStrategy(input.targetAudience, input.budget || 500)
  };
}

function getPlatformStrategy(platform: string, audience: string) {
  const strategies = {
    instagram: `Visual storytelling approach with high-quality images and reels. Focus on ${audience} pain points through carousel posts and stories.`,
    twitter: `Thought leadership and real-time engagement. Share insights, participate in relevant conversations, and build community.`,
    linkedin: `Professional networking and B2B content. Share industry insights, company updates, and professional achievements.`,
    tiktok: `Short-form video content with trending audio. Quick tips, behind-the-scenes, and entertainment-focused content.`,
    youtube: `Long-form educational content. Tutorials, case studies, and in-depth product demonstrations.`,
    facebook: `Community building with groups and events. Share valuable content and foster discussions.`
  };
  return strategies[platform as keyof typeof strategies] || "Platform-specific strategy to be developed";
}

function getContentMix(platform: string, contentTypes: string[]) {
  return contentTypes.map(type => ({
    type,
    percentage: Math.floor(100 / contentTypes.length),
    examples: getContentExamples(type, platform)
  }));
}

function getContentExamples(type: string, platform: string) {
  const examples = {
    educational: [`How-to posts for ${platform}`, "Tips and tricks", "Industry insights"],
    "behind-the-scenes": ["Team introductions", "Product development", "Office culture"],
    "user-generated": ["Customer testimonials", "User-created content", "Reviews and feedback"],
    promotional: ["Product announcements", "Special offers", "Feature highlights"],
    entertainment: ["Memes", "Fun facts", "Interactive polls"]
  };
  return examples[type as keyof typeof examples] || ["Content examples to be developed"];
}

function getPostingFrequency(platform: string) {
  const frequencies = {
    instagram: "1-2 posts per day, 3-5 stories",
    twitter: "3-5 tweets per day",
    linkedin: "1 post per day, 2-3 articles per week",
    tiktok: "1-2 videos per day",
    youtube: "2-3 videos per week",
    facebook: "1 post per day"
  };
  return frequencies[platform as keyof typeof frequencies] || "Daily posting recommended";
}

function getBestPostingTimes(platform: string) {
  const times = {
    instagram: "11 AM - 1 PM and 7 PM - 9 PM",
    twitter: "9 AM - 10 AM and 7 PM - 9 PM",
    linkedin: "8 AM - 10 AM and 5 PM - 6 PM",
    tiktok: "6 AM - 10 AM and 7 PM - 9 PM",
    youtube: "2 PM - 4 PM and 8 PM - 11 PM",
    facebook: "1 PM - 3 PM and 7 PM - 9 PM"
  };
  return times[platform as keyof typeof times] || "Peak audience hours vary by platform";
}

function getCrossPlatformApproach(platforms: string[]) {
  return {
    contentRepurposing: "Adapt content formats for each platform while maintaining consistent messaging",
    brandConsistency: "Use consistent visual branding, tone, and messaging across all platforms",
    crossPromotion: "Promote other social channels within each platform to build comprehensive following"
  };
}

function getEngagementTactics(audience: string) {
  return [
    `Host Q&A sessions about topics relevant to ${audience}`,
    "Respond to comments within 2-4 hours during business hours",
    "Create polls and interactive content to boost engagement",
    "Share user-generated content and tag creators",
    "Collaborate with micro-influencers in your niche"
  ];
}

function getInfluencerStrategy(audience: string, budget: number) {
  if (budget < 200) {
    return {
      approach: "Micro-influencer partnerships",
      strategy: "Partner with 3-5 micro-influencers (1K-10K followers) for authentic endorsements",
      budget: "$50-150 per collaboration"
    };
  } else if (budget < 1000) {
    return {
      approach: "Mid-tier influencer mix",
      strategy: "Combine micro-influencers with 1-2 mid-tier influencers (10K-100K followers)",
      budget: "$200-500 per mid-tier collaboration"
    };
  } else {
    return {
      approach: "Premium influencer strategy",
      strategy: "Target macro-influencers (100K+ followers) for maximum reach",
      budget: "$1000+ per collaboration"
    };
  }
}

function generateContentCalendar(input: z.infer<typeof SocialMediaStrategySchema>) {
  const calendar = [];
  for (let week = 1; week <= 4; week++) {
    calendar.push({
      week,
      theme: getWeeklyTheme(week),
      posts: generateWeeklyPosts(input.platforms, input.contentTypes)
    });
  }
  return calendar;
}

function getWeeklyTheme(week: number) {
  const themes = [
    "Brand Introduction & Problem Awareness",
    "Solution Showcase & Social Proof",
    "Community Building & Engagement",
    "Launch Preparation & Call-to-Action"
  ];
  return themes[week - 1] || "Content theme to be defined";
}

function generateWeeklyPosts(platforms: string[], contentTypes: string[]) {
  return platforms.map(platform => ({
    platform,
    posts: contentTypes.slice(0, 3).map((type, index) => ({
      day: `Day ${index + 1}`,
      type,
      content: `${type} content for ${platform}`,
      hashtags: generateHashtags(platform)
    }))
  }));
}

function generateHashtags(platform: string) {
  const platformHashtags = {
    instagram: ["#startup", "#entrepreneur", "#innovation", "#productivity"],
    twitter: ["#StartupLife", "#ProductLaunch", "#Innovation"],
    linkedin: ["#BusinessGrowth", "#Entrepreneurship", "#Leadership"],
    tiktok: ["#entrepreneur", "#business", "#startup", "#productivity"],
    youtube: ["startup", "business", "entrepreneurship"],
    facebook: ["#SmallBusiness", "#Entrepreneur", "#Innovation"]
  };
  return platformHashtags[platform as keyof typeof platformHashtags] || ["#business", "#startup"];
}

function generateSocialMetrics(input: z.infer<typeof SocialMediaStrategySchema>) {
  return {
    kpis: [
      "Follower growth rate (target: 10-15% monthly)",
      "Engagement rate (target: 3-6% per post)",
      "Click-through rate to website (target: 2-5%)",
      "Conversion rate from social traffic (target: 1-3%)"
    ],
    trackingTools: [
      "Native platform analytics",
      "Google Analytics for website traffic",
      "Social media management tools (Buffer, Hootsuite)",
      "UTM parameters for campaign tracking"
    ],
    reportingSchedule: "Weekly performance reviews, monthly strategy adjustments"
  };
}

function generateBudgetBreakdown(budget: number) {
  return {
    total: budget,
    breakdown: {
      contentCreation: Math.floor(budget * 0.4),
      paidPromotion: Math.floor(budget * 0.3),
      influencerPartnerships: Math.floor(budget * 0.2),
      tools: Math.floor(budget * 0.1)
    },
    recommendations: budget < 300 ? 
      "Focus on organic growth and community building" :
      "Balanced mix of organic and paid strategies"
  };
} 