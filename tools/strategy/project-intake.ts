import { z } from "zod";

const ProjectIntakeSchema = z.object({
  projectName: z.string().describe("Name of the project/product"),
  elevatorPitch: z.string().max(300).describe("Short description of the project (max 300 chars)"),
  creatorSkills: z.string().describe("Team size, tech stack, budget, follower count, email list"),
  targetAudience: z.string().describe("Demographics and pain points of target audience"),
  launchGoal: z.string().describe("SMART goal (e.g., '$25k revenue in 60 days, 200 paid students')"),
  launchWindow: z.string().describe("Preferred launch dates or 'ASAP'"),
  riskTolerance: z.enum(["low", "medium", "high"]).describe("Risk tolerance level"),
  existingAssets: z.string().describe("Current assets: docs, videos, designs, etc."),
  constraints: z.string().describe("Key constraints: no paid ads, GDPR compliance, etc.")
});

export const projectIntakeTool = {
  name: "project_intake_analysis",
  description: "Analyze project details and provide initial assessment with prioritized recommendations",
  inputSchema: ProjectIntakeSchema,
  handler: async (input: z.infer<typeof ProjectIntakeSchema>) => {
    const analysis = generateProjectAnalysis(input);
    return {
      project: input.projectName,
      analysis: analysis,
      nextSteps: generateNextSteps(input),
      timeline: generateInitialTimeline(input)
    };
  },
};

function generateProjectAnalysis(project: z.infer<typeof ProjectIntakeSchema>) {
  const riskLevel = project.riskTolerance;
  const hasAssets = project.existingAssets.toLowerCase() !== 'none' && project.existingAssets.trim() !== '';
  
  return {
    marketViability: analyzeMarketViability(project.targetAudience, project.launchGoal),
    resourceAssessment: assessResources(project.creatorSkills, project.existingAssets),
    riskFactors: identifyRiskFactors(project.constraints, riskLevel),
    recommendedApproach: recommendApproach(riskLevel, hasAssets, project.launchWindow)
  };
}

function analyzeMarketViability(audience: string, goal: string) {
  return {
    score: "High",
    reasoning: `Target audience clearly defined. ${goal.includes('$') ? 'Revenue goal is specific and measurable.' : 'Goal needs revenue specificity.'}`,
    recommendations: [
      "Validate audience pain points with surveys",
      "Research competitor pricing strategies", 
      "Test messaging with small audience segment"
    ]
  };
}

function assessResources(skills: string, assets: string) {
  const hasTeam = skills.toLowerCase().includes('team') || skills.includes('2') || skills.includes('3');
  const hasBudget = skills.toLowerCase().includes('budget') || skills.includes('$');
  
  return {
    teamStrength: hasTeam ? "Good" : "Solo founder - consider partnerships",
    technicalCapability: skills.toLowerCase().includes('tech') ? "Strong" : "May need technical support",
    contentReadiness: assets.toLowerCase() !== 'none' ? "Assets available" : "Content creation needed",
    recommendations: [
      !hasTeam ? "Consider bringing on co-founder or key contractor" : "Leverage team diversity",
      !hasBudget ? "Bootstrap approach recommended" : "Allocate budget strategically",
      "Prioritize MVP features for fastest validation"
    ]
  };
}

function identifyRiskFactors(constraints: string, riskTolerance: string) {
  const factors = [];
  if (constraints.toLowerCase().includes('no paid ads')) factors.push("Organic growth dependency");
  if (constraints.toLowerCase().includes('gdpr')) factors.push("Compliance complexity");
  if (riskTolerance === 'low') factors.push("Conservative timeline needed");
  
  return {
    factors: factors.length > 0 ? factors : ["Standard launch risks"],
    mitigation: generateMitigationStrategies(factors, riskTolerance)
  };
}

function generateMitigationStrategies(factors: string[], riskTolerance: string) {
  const strategies = [];
  if (factors.includes("Organic growth dependency")) {
    strategies.push("Focus on content marketing and partnerships");
    strategies.push("Build email list pre-launch");
  }
  if (factors.includes("Compliance complexity")) {
    strategies.push("Consult legal expert early");
    strategies.push("Use compliant tools and platforms");
  }
  if (riskTolerance === 'low') {
    strategies.push("Extended beta testing period");
    strategies.push("Gradual feature rollout");
  }
  return strategies.length > 0 ? strategies : ["Standard risk management protocols"];
}

function recommendApproach(riskTolerance: string, hasAssets: boolean, launchWindow: string) {  
  if (riskTolerance === 'high' && hasAssets) {
    return "Aggressive MVP launch with existing assets";
  } else if (riskTolerance === 'low') {
    return "Staged validation approach with beta testing";
  } else {
    return "Balanced approach: validate core features, then scale";
  }
}

function generateNextSteps(project: z.infer<typeof ProjectIntakeSchema>) {
  return [
    {
      priority: 1,
      action: "Market Validation",
      details: "Survey 20-50 target customers about pain points",
      timeline: "Week 1-2"
    },
    {
      priority: 2, 
      action: "MVP Definition",
      details: "Define minimum viable product features",
      timeline: "Week 2-3"
    },
    {
      priority: 3,
      action: "Revenue Model",
      details: "Finalize pricing and payment structure",
      timeline: "Week 3-4"
    }
  ];
}

function generateInitialTimeline(project: z.infer<typeof ProjectIntakeSchema>) {
  const isASAP = project.launchWindow.toLowerCase().includes('asap');
  const baseWeeks = isASAP ? 8 : 12;
  
  return {
    totalWeeks: baseWeeks,
    phases: [
      { phase: "Research & Validation", weeks: Math.ceil(baseWeeks * 0.25) },
      { phase: "Development & Content", weeks: Math.ceil(baseWeeks * 0.4) },
      { phase: "Marketing & Pre-launch", weeks: Math.ceil(baseWeeks * 0.2) },
      { phase: "Launch & Optimization", weeks: Math.ceil(baseWeeks * 0.15) }
    ]
  };
} 