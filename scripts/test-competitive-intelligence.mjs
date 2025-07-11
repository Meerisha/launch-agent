import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

console.log('🔍 Testing Competitive Intelligence API...\n');

// Test data
const testData = {
  companyName: 'EcoTech Solutions',
  industry: 'cleantech',
  region: 'US',
  analysisDepth: 'detailed',
  includeFinancing: true,
  includeTrends: true,
  includeCompetitors: true
};

async function testCompetitiveIntelligenceAPI() {
  try {
    console.log('📊 Test Data:');
    console.log(JSON.stringify(testData, null, 2));
    console.log('\n⏳ Calling competitive intelligence API...\n');

    const response = await fetch(`${BASE_URL}/api/competitive-intelligence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    console.log('✅ API Response Status:', response.status);
    console.log('📈 Analysis Results:\n');

    if (result.success) {
      const analysis = result.data;
      
      // Company Information
      console.log('🏢 Company Analysis:');
      console.log(`   Name: ${analysis.company.name}`);
      console.log(`   Industry: ${analysis.company.industry}`);
      console.log(`   Analysis Date: ${analysis.company.analysisDate}\n`);

      // Market Trends
      console.log('📊 Market Trends:');
      console.log(`   Industry Growth: ${analysis.marketTrends.industryGrowth}`);
      console.log(`   Market Size: ${analysis.marketTrends.marketSize}`);
      console.log(`   Key Trends: ${analysis.marketTrends.keyTrends.length} trends identified\n`);

      // Competitors
      console.log('🏆 Competitive Landscape:');
      console.log(`   Direct Competitors: ${analysis.competitors.direct.length}`);
      console.log(`   Indirect Competitors: ${analysis.competitors.indirect.length}`);
      console.log(`   Emerging Competitors: ${analysis.competitors.emerging.length}\n`);

      // Funding Landscape
      console.log('💰 Funding Landscape:');
      console.log(`   Recent Rounds: ${analysis.fundingLandscape.recentRounds.length}`);
      console.log(`   Total Industry Funding: ${analysis.fundingLandscape.totalIndustryFunding}`);
      console.log(`   Average Round Size: ${analysis.fundingLandscape.averageRoundSize}\n`);

      // Opportunities
      console.log('🚀 Market Opportunities:');
      console.log(`   Market Gaps: ${analysis.opportunities.marketGaps.length} identified`);
      console.log(`   Emerging Trends: ${analysis.opportunities.emergingTrends.length} trends`);
      console.log(`   Competitive Advantages: ${analysis.opportunities.competitiveAdvantages.length} advantages\n`);

      // Recommendations
      console.log('💡 Strategic Recommendations:');
      console.log(`   Positioning: ${analysis.recommendations.positioning.length} strategies`);
      console.log(`   Differentiation: ${analysis.recommendations.differentiation.length} approaches`);
      console.log(`   Timing: ${analysis.recommendations.timing.length} considerations\n`);

      console.log('🎯 Sample Market Gaps:');
      analysis.opportunities.marketGaps.slice(0, 2).forEach((gap, index) => {
        console.log(`   ${index + 1}. ${gap}`);
      });

      console.log('\n📈 Sample Positioning Recommendations:');
      analysis.recommendations.positioning.slice(0, 2).forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec}`);
      });

    } else {
      console.log('❌ API Error:', result.error);
    }

  } catch (error) {
    console.error('❌ Test Failed:', error.message);
  }
}

async function testChatIntegration() {
  console.log('\n🤖 Testing Chat Integration...\n');

  const chatData = {
    message: "Analyze my competitors and market intelligence for EcoTech Solutions in the cleantech industry",
    conversationHistory: [
      { role: 'user', content: 'I have a cleantech startup called EcoTech Solutions' },
      { role: 'assistant', content: 'Tell me more about your cleantech solution!' }
    ],
    context: {
      projectName: 'EcoTech Solutions',
      industry: 'cleantech'
    }
  };

  try {
    console.log('💬 Sending chat message for competitive intelligence...\n');

    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chatData)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    console.log('✅ Chat Response Status:', response.status);
    console.log('🤖 AI Response:', result.response);
    
    if (result.analysis && result.analysis.competitiveIntelligence) {
      console.log('\n🔍 Competitive Intelligence Generated:');
      console.log(`   Company: ${result.analysis.competitiveIntelligence.companyName}`);
      console.log(`   Industry: ${result.analysis.competitiveIntelligence.industry}`);
      console.log(`   Generated At: ${result.analysis.competitiveIntelligence.generatedAt}`);
    }

  } catch (error) {
    console.error('❌ Chat Test Failed:', error.message);
  }
}

async function testAPIDocumentation() {
  console.log('\n📖 Testing API Documentation...\n');

  try {
    const response = await fetch(`${BASE_URL}/api/competitive-intelligence`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const docs = await response.json();

    console.log('✅ Documentation Response:');
    console.log(`   Name: ${docs.name}`);
    console.log(`   Description: ${docs.description}`);
    console.log(`   Methods: ${docs.methods.join(', ')}`);
    console.log(`   Features: ${docs.features.length} features listed`);

  } catch (error) {
    console.error('❌ Documentation Test Failed:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Competitive Intelligence Tests...\n');
  
  await testCompetitiveIntelligenceAPI();
  await testChatIntegration();
  await testAPIDocumentation();
  
  console.log('\n✨ All tests completed!\n');
}

runAllTests(); 