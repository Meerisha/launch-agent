#!/usr/bin/env node

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const API_BASE_URL = 'http://localhost:3000';

// Test data for report generation
const testData = {
  projectName: "EcoTech Solutions",
  companyName: "GreenTech Innovations",
  analysis: {
    projectAnalysis: {
      analysis: {
        marketViability: {
          score: 8.5,
          reasoning: "Strong market demand for sustainable technology solutions with growing investor interest and regulatory support."
        },
        recommendedApproach: "Focus on B2B market with enterprise partnerships and gradual consumer market expansion.",
        resourceAssessment: {
          teamStrength: "Strong technical team with renewable energy expertise",
          technicalCapability: "Advanced IoT and AI capabilities for energy optimization",
          contentReadiness: "Well-prepared with patents and technical documentation"
        },
        riskFactors: {
          factors: [
            "Regulatory changes in renewable energy sector",
            "Competition from established energy companies",
            "Technology adoption barriers in traditional industries"
          ]
        }
      },
      nextSteps: [
        {
          priority: "High",
          action: "Secure Series A funding",
          details: "Target $5M funding round for product development and market entry",
          timeline: "3-6 months"
        },
        {
          priority: "Medium",
          action: "Build strategic partnerships",
          details: "Partner with energy companies and IoT platform providers",
          timeline: "4-8 months"
        }
      ]
    },
    revenueProjections: {
      summary: {
        totalRevenue: 2400000,
        monthlyAverage: 200000,
        requiredLeads: 1200
      },
      breakEvenAnalysis: {
        breakEvenUnits: 240,
        timeToBreakEven: 18,
        profitMargin: 35
      },
      scenarioAnalysis: {
        conservative: {
          revenue: 1800000,
          probability: "70%"
        },
        realistic: {
          revenue: 2400000,
          probability: "50%"
        },
        optimistic: {
          revenue: 3200000,
          probability: "20%"
        }
      }
    },
    competitiveIntelligence: {
      marketTrends: [
        {
          trend: "Growing demand for energy efficiency solutions",
          impact: "High",
          timeframe: "2024-2026"
        },
        {
          trend: "Increased IoT adoption in industrial sectors",
          impact: "Medium",
          timeframe: "2024-2025"
        }
      ],
      competitiveLandscape: {
        directCompetitors: [
          {
            name: "EnergyFlow Systems",
            description: "Enterprise energy management platform",
            strength: "Market presence"
          },
          {
            name: "SmartGrid Solutions",
            description: "AI-powered grid optimization",
            strength: "Technology innovation"
          }
        ],
        indirectCompetitors: [
          {
            name: "Traditional Energy Consultants",
            description: "Manual energy auditing services",
            strength: "Established relationships"
          }
        ],
        emergingCompetitors: [
          {
            name: "CleanTech Startups",
            description: "Various sustainable technology solutions",
            strength: "Innovation speed"
          }
        ]
      }
    },
    launchStrategy: {
      timeline: {
        phases: [
          { phase: "Product Development", duration: 12 },
          { phase: "Beta Testing", duration: 8 },
          { phase: "Market Launch", duration: 6 },
          { phase: "Scale Up", duration: 16 }
        ]
      },
      budgetAllocation: {
        breakdown: {
          development: 150000,
          marketing: 80000,
          operations: 50000,
          sales: 70000
        }
      },
      strategy: {
        tactics: [
          {
            description: "Partner with energy consulting firms for market entry"
          },
          {
            description: "Develop thought leadership content on energy efficiency"
          },
          {
            description: "Attend major energy and sustainability conferences"
          }
        ]
      }
    }
  }
};

// Custom branding options
const brandingOptions = {
  primaryColor: '#2563eb',
  secondaryColor: '#64748b',
  accentColor: '#059669',
  fontFamily: 'Arial, sans-serif'
};

// Test configurations
const testConfigs = [
  {
    name: 'Comprehensive PDF Report',
    reportType: 'comprehensive',
    format: 'pdf',
    branding: brandingOptions
  },
  {
    name: 'Comprehensive PowerPoint Report',
    reportType: 'comprehensive',
    format: 'pptx',
    branding: brandingOptions
  },
  {
    name: 'Competitive Intelligence PDF',
    reportType: 'competitive-intelligence',
    format: 'pdf',
    branding: brandingOptions
  },
  {
    name: 'Revenue Projections PowerPoint',
    reportType: 'revenue-projections',
    format: 'pptx',
    branding: brandingOptions
  },
  {
    name: 'Launch Strategy PDF',
    reportType: 'launch-strategy',
    format: 'pdf',
    branding: brandingOptions
  }
];

async function testReportGeneration() {
  console.log('🧪 Testing LaunchPilot AI Report Generation API');
  console.log('=' .repeat(60));
  
  // Test API availability
  console.log('\n1. Testing API availability...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/export`);
    const data = await response.json();
    console.log('✅ API is accessible');
    console.log(`   Version: ${data.version}`);
    console.log(`   Supported formats: ${data.supportedFormats.join(', ')}`);
    console.log(`   Supported report types: ${data.supportedReportTypes.join(', ')}`);
  } catch (error) {
    console.error('❌ API is not accessible:', error.message);
    return;
  }
  
  // Test template retrieval
  console.log('\n2. Testing template retrieval...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/export?action=templates`);
    const data = await response.json();
    console.log('✅ Templates retrieved successfully');
    console.log(`   Available templates: ${data.templates.length}`);
    data.templates.forEach(template => {
      console.log(`   - ${template.name}: ${template.description}`);
    });
  } catch (error) {
    console.error('❌ Failed to retrieve templates:', error.message);
  }
  
  // Test format information
  console.log('\n3. Testing format information...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/export?action=formats`);
    const data = await response.json();
    console.log('✅ Formats retrieved successfully');
    data.formats.forEach(format => {
      console.log(`   - ${format.name} (.${format.extension}): ${format.description}`);
    });
  } catch (error) {
    console.error('❌ Failed to retrieve formats:', error.message);
  }
  
  // Test branding options
  console.log('\n4. Testing branding options...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/export?action=branding-options`);
    const data = await response.json();
    console.log('✅ Branding options retrieved successfully');
    Object.entries(data.options).forEach(([key, option]) => {
      console.log(`   - ${option.label} (${option.type}): ${option.description || 'N/A'}`);
    });
  } catch (error) {
    console.error('❌ Failed to retrieve branding options:', error.message);
  }
  
  // Test report generation
  console.log('\n5. Testing report generation...');
  const results = [];
  
  for (const config of testConfigs) {
    console.log(`\n   Testing: ${config.name}`);
    
    try {
      const payload = {
        ...testData,
        reportType: config.reportType,
        format: config.format,
        branding: config.branding
      };
      
      const startTime = Date.now();
      const response = await fetch(`${API_BASE_URL}/api/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type');
        const contentDisposition = response.headers.get('content-disposition');
        const filename = contentDisposition 
          ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
          : `test_${config.reportType}.${config.format}`;
        
        // Save file for verification
        const outputDir = 'test-reports';
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        
        const filepath = path.join(outputDir, filename);
        fs.writeFileSync(filepath, Buffer.from(buffer));
        
        console.log(`   ✅ ${config.name} generated successfully`);
        console.log(`      Duration: ${duration}ms`);
        console.log(`      Size: ${(buffer.byteLength / 1024).toFixed(2)} KB`);
        console.log(`      Content-Type: ${contentType}`);
        console.log(`      Saved to: ${filepath}`);
        
        results.push({
          config: config.name,
          status: 'success',
          duration,
          size: buffer.byteLength,
          filename: filepath
        });
      } else {
        const errorData = await response.json();
        console.log(`   ❌ ${config.name} failed: ${errorData.error}`);
        results.push({
          config: config.name,
          status: 'failed',
          error: errorData.error
        });
      }
    } catch (error) {
      console.log(`   ❌ ${config.name} failed: ${error.message}`);
      results.push({
        config: config.name,
        status: 'failed',
        error: error.message
      });
    }
  }
  
  // Summary
  console.log('\n6. Test Summary');
  console.log('=' .repeat(60));
  const successful = results.filter(r => r.status === 'success');
  const failed = results.filter(r => r.status === 'failed');
  
  console.log(`   Total tests: ${results.length}`);
  console.log(`   Successful: ${successful.length}`);
  console.log(`   Failed: ${failed.length}`);
  
  if (successful.length > 0) {
    console.log('\n   ✅ Successful reports:');
    successful.forEach(result => {
      console.log(`      - ${result.config}: ${(result.size / 1024).toFixed(2)} KB in ${result.duration}ms`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n   ❌ Failed reports:');
    failed.forEach(result => {
      console.log(`      - ${result.config}: ${result.error}`);
    });
  }
  
  console.log('\n🎉 Report generation testing completed!');
  
  if (successful.length > 0) {
    console.log('\n📁 Generated reports can be found in the "test-reports" directory');
  }
}

// Run the test
testReportGeneration().catch(console.error); 