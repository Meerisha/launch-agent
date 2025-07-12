export interface SampleProject {
  id: string;
  name: string;
  description: string;
  industry: string;
  category: 'saas' | 'course' | 'consulting' | 'ecommerce' | 'app' | 'service';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  data: {
    projectName: string;
    companyName: string;
    targetAudience: string;
    elevatorPitch: string;
    launchGoal: string;
    analysis: any;
  };
}

export const sampleProjects: SampleProject[] = [
  {
    id: 'saas-crm',
    name: 'AI-Powered CRM SaaS',
    description: 'B2B SaaS platform for small business customer relationship management',
    industry: 'Technology',
    category: 'saas',
    difficulty: 'intermediate',
    data: {
      projectName: 'SmartCRM Pro',
      companyName: 'TechFlow Solutions',
      targetAudience: 'Small to medium businesses (10-100 employees) looking to streamline customer relationships',
      elevatorPitch: 'SmartCRM Pro uses AI to automatically prioritize leads, predict customer churn, and suggest optimal follow-up actions, helping SMBs increase sales by 35% while reducing manual CRM work by 60%.',
      launchGoal: '$50,000 MRR within 120 days with 200 paying customers',
      analysis: {
        revenueProjections: {
          summary: {
            totalRevenue: 600000,
            monthlyAverage: 50000,
            requiredLeads: 2000,
            conversionRate: 0.1,
            averageOrderValue: 299
          },
          scenarioAnalysis: {
            conservative: { revenue: 400000, customers: 140 },
            realistic: { revenue: 600000, customers: 200 },
            optimistic: { revenue: 900000, customers: 300 }
          }
        },
        competitiveIntelligence: {
          marketTrends: [
            { trend: 'AI-powered sales tools growing 45% YoY', impact: 'high' },
            { trend: 'SMB digitization accelerating post-COVID', impact: 'high' },
            { trend: 'Integration-first approach becoming standard', impact: 'medium' }
          ],
          competitiveLandscape: {
            directCompetitors: [
              { name: 'HubSpot', strength: 'Brand recognition', weakness: 'Complexity for SMBs' },
              { name: 'Pipedrive', strength: 'Simplicity', weakness: 'Limited AI features' }
            ],
            indirectCompetitors: [
              { name: 'Salesforce', strength: 'Enterprise features', weakness: 'Price point' },
              { name: 'Monday.com', strength: 'Flexibility', weakness: 'Not CRM-specific' }
            ]
          }
        }
      }
    }
  },
  {
    id: 'online-course',
    name: 'Zero-to-Launch Bootcamp',
    description: 'Online course teaching entrepreneurs how to launch their first product',
    industry: 'Education',
    category: 'course',
    difficulty: 'beginner',
    data: {
      projectName: 'Zero-to-Launch Bootcamp',
      companyName: 'Launch Academy',
      targetAudience: 'Aspiring entrepreneurs aged 25-45 with an idea but no launch experience',
      elevatorPitch: 'A comprehensive 8-week bootcamp that takes complete beginners from idea to first sale, with proven frameworks, live coaching, and a supportive community of fellow entrepreneurs.',
      launchGoal: '$100,000 revenue in first 90 days with 200 students',
      analysis: {
        revenueProjections: {
          summary: {
            totalRevenue: 150000,
            monthlyAverage: 50000,
            requiredLeads: 5000,
            conversionRate: 0.04,
            averageOrderValue: 497
          },
          scenarioAnalysis: {
            conservative: { revenue: 100000, students: 150 },
            realistic: { revenue: 150000, students: 200 },
            optimistic: { revenue: 250000, students: 300 }
          }
        },
        competitiveIntelligence: {
          marketTrends: [
            { trend: 'Online education market growing 20% annually', impact: 'high' },
            { trend: 'Entrepreneurship courses in high demand', impact: 'high' },
            { trend: 'Community-based learning preferred', impact: 'medium' }
          ],
          competitiveLandscape: {
            directCompetitors: [
              { name: 'Teachable creators', strength: 'Platform reach', weakness: 'Generic content' },
              { name: 'Local business coaches', strength: 'Personal touch', weakness: 'Limited scale' }
            ]
          }
        }
      }
    }
  },
  {
    id: 'consulting-service',
    name: 'Digital Marketing Consulting',
    description: 'Specialized consulting for e-commerce brands scaling their digital marketing',
    industry: 'Marketing',
    category: 'consulting',
    difficulty: 'advanced',
    data: {
      projectName: 'Growth Scale Consulting',
      companyName: 'Digital Growth Partners',
      targetAudience: 'E-commerce brands doing $100K-$1M annual revenue seeking to scale marketing',
      elevatorPitch: 'We help e-commerce brands scale from $100K to $1M+ through data-driven marketing strategies, focusing on profitable customer acquisition and retention optimization.',
      launchGoal: '$25,000 MRR within 60 days with 5 high-value clients',
      analysis: {
        revenueProjections: {
          summary: {
            totalRevenue: 300000,
            monthlyAverage: 25000,
            requiredLeads: 500,
            conversionRate: 0.02,
            averageOrderValue: 5000
          },
          scenarioAnalysis: {
            conservative: { revenue: 180000, clients: 3 },
            realistic: { revenue: 300000, clients: 5 },
            optimistic: { revenue: 480000, clients: 8 }
          }
        },
        competitiveIntelligence: {
          marketTrends: [
            { trend: 'E-commerce growth creating demand for specialists', impact: 'high' },
            { trend: 'Performance marketing becoming more complex', impact: 'high' },
            { trend: 'Brands seeking long-term partnerships', impact: 'medium' }
          ],
          competitiveLandscape: {
            directCompetitors: [
              { name: 'Digital marketing agencies', strength: 'Full service', weakness: 'Generic approach' },
              { name: 'Freelance marketers', strength: 'Cost effective', weakness: 'Limited capacity' }
            ]
          }
        }
      }
    }
  },
  {
    id: 'mobile-app',
    name: 'Fitness Tracking App',
    description: 'Mobile app for personalized fitness tracking with AI coaching',
    industry: 'Health & Fitness',
    category: 'app',
    difficulty: 'intermediate',
    data: {
      projectName: 'FitCoach AI',
      companyName: 'Wellness Tech Inc',
      targetAudience: 'Health-conscious individuals aged 25-40 seeking personalized fitness guidance',
      elevatorPitch: 'FitCoach AI provides personalized workout plans and nutrition guidance using AI, adapting to your progress and preferences to help you achieve your fitness goals 3x faster.',
      launchGoal: '10,000 app downloads and $15,000 MRR within 90 days',
      analysis: {
        revenueProjections: {
          summary: {
            totalRevenue: 180000,
            monthlyAverage: 15000,
            requiredLeads: 50000,
            conversionRate: 0.2,
            averageOrderValue: 9.99
          },
          scenarioAnalysis: {
            conservative: { revenue: 120000, downloads: 8000 },
            realistic: { revenue: 180000, downloads: 12000 },
            optimistic: { revenue: 300000, downloads: 20000 }
          }
        },
        competitiveIntelligence: {
          marketTrends: [
            { trend: 'AI-powered health apps growing 60% YoY', impact: 'high' },
            { trend: 'Personalization becoming expected feature', impact: 'high' },
            { trend: 'Integration with wearables essential', impact: 'medium' }
          ],
          competitiveLandscape: {
            directCompetitors: [
              { name: 'MyFitnessPal', strength: 'Large user base', weakness: 'Limited AI features' },
              { name: 'Fitbit App', strength: 'Hardware integration', weakness: 'Basic coaching' }
            ]
          }
        }
      }
    }
  },
  {
    id: 'ecommerce-store',
    name: 'Sustainable Fashion Brand',
    description: 'Direct-to-consumer sustainable fashion brand targeting eco-conscious millennials',
    industry: 'Fashion',
    category: 'ecommerce',
    difficulty: 'intermediate',
    data: {
      projectName: 'EcoThread',
      companyName: 'Sustainable Style Co',
      targetAudience: 'Eco-conscious millennials and Gen Z (22-35) with disposable income of $50K+',
      elevatorPitch: 'EcoThread creates stylish, sustainable clothing using recycled materials and ethical manufacturing, proving that fashion can be both beautiful and environmentally responsible.',
      launchGoal: '$75,000 revenue in first 120 days with 500 customers',
      analysis: {
        revenueProjections: {
          summary: {
            totalRevenue: 300000,
            monthlyAverage: 25000,
            requiredLeads: 10000,
            conversionRate: 0.05,
            averageOrderValue: 85
          },
          scenarioAnalysis: {
            conservative: { revenue: 200000, customers: 400 },
            realistic: { revenue: 300000, customers: 600 },
            optimistic: { revenue: 450000, customers: 900 }
          }
        },
        competitiveIntelligence: {
          marketTrends: [
            { trend: 'Sustainable fashion market growing 35% annually', impact: 'high' },
            { trend: 'Gen Z prioritizing ethical brands', impact: 'high' },
            { trend: 'Direct-to-consumer model gaining traction', impact: 'medium' }
          ],
          competitiveLandscape: {
            directCompetitors: [
              { name: 'Everlane', strength: 'Brand transparency', weakness: 'Price point' },
              { name: 'Patagonia', strength: 'Environmental credibility', weakness: 'Limited fashion focus' }
            ]
          }
        }
      }
    }
  },
  {
    id: 'local-service',
    name: 'Home Cleaning Service',
    description: 'Premium home cleaning service with eco-friendly products and online booking',
    industry: 'Services',
    category: 'service',
    difficulty: 'beginner',
    data: {
      projectName: 'SparkleHome Pro',
      companyName: 'Clean Living Services',
      targetAudience: 'Busy professionals and families ($75K+ household income) in suburban areas',
      elevatorPitch: 'SparkleHome Pro provides premium home cleaning services using eco-friendly products, with easy online booking and 100% satisfaction guarantee.',
      launchGoal: '$20,000 MRR within 90 days serving 100 regular customers',
      analysis: {
        revenueProjections: {
          summary: {
            totalRevenue: 240000,
            monthlyAverage: 20000,
            requiredLeads: 2000,
            conversionRate: 0.1,
            averageOrderValue: 120
          },
          scenarioAnalysis: {
            conservative: { revenue: 150000, customers: 75 },
            realistic: { revenue: 240000, customers: 100 },
            optimistic: { revenue: 360000, customers: 150 }
          }
        },
        competitiveIntelligence: {
          marketTrends: [
            { trend: 'Home services market growing 8% annually', impact: 'medium' },
            { trend: 'Eco-friendly products in high demand', impact: 'high' },
            { trend: 'Online booking becoming standard', impact: 'high' }
          ],
          competitiveLandscape: {
            directCompetitors: [
              { name: 'Local cleaning services', strength: 'Established relationships', weakness: 'Limited technology' },
              { name: 'Handy/TaskRabbit', strength: 'Platform reach', weakness: 'Quality consistency' }
            ]
          }
        }
      }
    }
  }
];

export const getProjectsByCategory = (category: string) => {
  return sampleProjects.filter(project => project.category === category);
};

export const getProjectsByDifficulty = (difficulty: string) => {
  return sampleProjects.filter(project => project.difficulty === difficulty);
};

export const getProjectsByIndustry = (industry: string) => {
  return sampleProjects.filter(project => project.industry === industry);
};

export const getProjectById = (id: string) => {
  return sampleProjects.find(project => project.id === id);
};

export const categories = [
  { id: 'saas', name: 'SaaS/Software', icon: '💻' },
  { id: 'course', name: 'Online Course', icon: '📚' },
  { id: 'consulting', name: 'Consulting', icon: '🎯' },
  { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
  { id: 'app', name: 'Mobile App', icon: '📱' },
  { id: 'service', name: 'Local Service', icon: '🏠' }
];

export const difficulties = [
  { id: 'beginner', name: 'Beginner', description: 'Simple business model, proven market' },
  { id: 'intermediate', name: 'Intermediate', description: 'Moderate complexity, established competition' },
  { id: 'advanced', name: 'Advanced', description: 'Complex strategy, competitive landscape' }
];

export const industries = [
  'Technology',
  'Education',
  'Marketing',
  'Health & Fitness',
  'Fashion',
  'Services',
  'Finance',
  'Food & Beverage',
  'Real Estate',
  'Entertainment'
]; 