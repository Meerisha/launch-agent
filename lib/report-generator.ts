import { jsPDF } from 'jspdf';
import PptxGenJS from 'pptxgenjs';

export interface ReportData {
  type: 'competitive-intelligence' | 'market-research' | 'revenue-projections' | 'launch-strategy' | 'comprehensive';
  projectName: string;
  companyName?: string;
  analysis: any;
  generatedAt: string;
  branding?: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    fontFamily?: string;
  };
}

export interface ReportTemplate {
  name: string;
  description: string;
  sections: ReportSection[];
}

export interface ReportSection {
  title: string;
  type: 'text' | 'chart' | 'table' | 'metrics' | 'recommendations' | 'timeline';
  data: any;
  styling?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
  };
}

export class ReportGenerator {
  private brandingDefaults = {
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    accentColor: '#059669',
    fontFamily: 'Arial, sans-serif'
  };

  constructor(private reportData: ReportData) {}

  // Generate PDF Report
  async generatePDF(): Promise<Uint8Array> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 30;

    // Apply branding
    const branding = { ...this.brandingDefaults, ...this.reportData.branding };
    
    // Cover Page
    this.addCoverPage(doc, pageWidth, pageHeight, branding);
    
    // Table of Contents
    doc.addPage();
    yPosition = 30;
    this.addTableOfContents(doc, yPosition, pageWidth, branding);
    
    // Executive Summary
    doc.addPage();
    yPosition = 30;
    this.addExecutiveSummary(doc, yPosition, pageWidth, branding);
    
    // Analysis Sections based on report type
    switch (this.reportData.type) {
      case 'competitive-intelligence':
        this.addCompetitiveIntelligencePages(doc, branding);
        break;
      case 'market-research':
        this.addMarketResearchPages(doc, branding);
        break;
      case 'revenue-projections':
        this.addRevenueProjectionPages(doc, branding);
        break;
      case 'launch-strategy':
        this.addLaunchStrategyPages(doc, branding);
        break;
      case 'comprehensive':
        this.addComprehensivePages(doc, branding);
        break;
    }
    
    // Appendix
    this.addAppendix(doc, branding);

    const pdfOutput = doc.output('arraybuffer') as ArrayBuffer;
    return new Uint8Array(pdfOutput);
  }

  // Generate PowerPoint Report
  async generatePPTX(): Promise<Uint8Array> {
    const pptx = new PptxGenJS();
    
    // Set presentation properties
    pptx.author = 'LaunchPilot AI';
    pptx.company = this.reportData.companyName || 'LaunchPilot AI';
    pptx.title = `${this.reportData.projectName} - Analysis Report`;
    pptx.subject = 'AI-Powered Business Analysis Report';
    
    // Apply branding
    const branding = { ...this.brandingDefaults, ...this.reportData.branding };
    
    // Title Slide
    this.addTitleSlide(pptx, branding);
    
    // Executive Summary Slide
    this.addExecutiveSummarySlide(pptx, branding);
    
    // Analysis slides based on report type
    switch (this.reportData.type) {
      case 'competitive-intelligence':
        this.addCompetitiveIntelligenceSlides(pptx, branding);
        break;
      case 'market-research':
        this.addMarketResearchSlides(pptx, branding);
        break;
      case 'revenue-projections':
        this.addRevenueProjectionSlides(pptx, branding);
        break;
      case 'launch-strategy':
        this.addLaunchStrategySlides(pptx, branding);
        break;
      case 'comprehensive':
        this.addComprehensiveSlides(pptx, branding);
        break;
    }
    
    // Recommendations & Next Steps
    this.addRecommendationsSlide(pptx, branding);
    
    // Contact/Thank You slide
    this.addClosingSlide(pptx, branding);

    const pptxOutput = await pptx.write({ outputType: 'arraybuffer' });
    return new Uint8Array(pptxOutput as ArrayBuffer);
  }

  // PDF Helper Methods
  private addCoverPage(doc: jsPDF, pageWidth: number, pageHeight: number, branding: any) {
    // Header with branding
    const [r, g, b] = this.hexToRgb(branding.primaryColor);
    doc.setFillColor(r, g, b);
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('🚀 Business Analysis Report', pageWidth / 2, 35, { align: 'center' });
    
    // Project Name
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(this.reportData.projectName, pageWidth / 2, 100, { align: 'center' });
    
    // Report Type
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    const reportTypeText = this.formatReportType(this.reportData.type);
    doc.text(reportTypeText, pageWidth / 2, 120, { align: 'center' });
    
    // Generation Date
    doc.setFontSize(12);
    const date = new Date(this.reportData.generatedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Generated on ${date}`, pageWidth / 2, 140, { align: 'center' });
    
    // Company branding
    if (this.reportData.companyName) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Prepared for: ${this.reportData.companyName}`, pageWidth / 2, 170, { align: 'center' });
    }
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('Powered by LaunchPilot AI', pageWidth / 2, pageHeight - 20, { align: 'center' });
  }

  private addTableOfContents(doc: jsPDF, yPosition: number, pageWidth: number, branding: any) {
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Table of Contents', 20, yPosition);
    
    yPosition += 20;
    const sections = this.getTableOfContentsEntries();
    
    sections.forEach((section, index) => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`${index + 1}. ${section.title}`, 30, yPosition);
      doc.text(`${section.page}`, pageWidth - 30, yPosition, { align: 'right' });
      yPosition += 15;
    });
  }

  private addExecutiveSummary(doc: jsPDF, yPosition: number, pageWidth: number, branding: any) {
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Executive Summary', 20, yPosition);
    
    yPosition += 20;
    
    // Key Metrics Box
    const [ar, ag, ab] = this.hexToRgb(branding.accentColor);
    doc.setFillColor(ar, ag, ab);
    doc.rect(20, yPosition - 5, pageWidth - 40, 40, 'F');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Insights', 30, yPosition + 10);
    
    // Add summary based on report type
    yPosition += 25;
    const summary = this.generateExecutiveSummary();
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const summaryLines = doc.splitTextToSize(summary, pageWidth - 60);
    doc.text(summaryLines, 30, yPosition);
  }

  private addCompetitiveIntelligencePages(doc: jsPDF, branding: any) {
    if (!this.reportData.analysis.competitiveIntelligence) return;
    
    doc.addPage();
    let yPosition = 30;
    
    // Competitive Landscape
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Competitive Intelligence Analysis', 20, yPosition);
    
    yPosition += 20;
    const analysis = this.reportData.analysis.competitiveIntelligence;
    
    // Market Overview
    if (analysis.marketTrends) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Market Trends', 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      analysis.marketTrends.forEach((trend: any) => {
        doc.text(`• ${trend.trend}`, 30, yPosition);
        yPosition += 15;
      });
    }
    
    // Competitor Analysis
    if (analysis.competitiveLandscape) {
      yPosition += 10;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Competitive Landscape', 20, yPosition);
      yPosition += 15;
      
      ['directCompetitors', 'indirectCompetitors', 'emergingCompetitors'].forEach((type) => {
        if (analysis.competitiveLandscape[type]) {
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text(this.formatCompetitorType(type), 30, yPosition);
          yPosition += 10;
          
          analysis.competitiveLandscape[type].forEach((competitor: any) => {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text(`• ${competitor.name}: ${competitor.description}`, 40, yPosition);
            yPosition += 10;
          });
          yPosition += 5;
        }
      });
    }
  }

  private addMarketResearchPages(doc: jsPDF, branding: any) {
    // Implementation for market research report pages
    doc.addPage();
    let yPosition = 30;
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Market Research Analysis', 20, yPosition);
    
    // Add market research specific content
    yPosition += 20;
    // Implementation details...
  }

  private addRevenueProjectionPages(doc: jsPDF, branding: any) {
    if (!this.reportData.analysis.revenueProjections) return;
    
    doc.addPage();
    let yPosition = 30;
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Revenue Projections', 20, yPosition);
    
    yPosition += 20;
    const projections = this.reportData.analysis.revenueProjections;
    
    // Revenue Summary
    if (projections.summary) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Revenue Summary', 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Revenue: $${projections.summary.totalRevenue?.toLocaleString() || 'N/A'}`, 30, yPosition);
      yPosition += 10;
      doc.text(`Monthly Average: $${projections.summary.monthlyAverage?.toLocaleString() || 'N/A'}`, 30, yPosition);
      yPosition += 10;
      doc.text(`Required Leads: ${projections.summary.requiredLeads?.toLocaleString() || 'N/A'}`, 30, yPosition);
      yPosition += 20;
    }
    
    // Scenario Analysis
    if (projections.scenarioAnalysis) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Scenario Analysis', 20, yPosition);
      yPosition += 15;
      
      ['conservative', 'realistic', 'optimistic'].forEach((scenario) => {
        if (projections.scenarioAnalysis[scenario]) {
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text(`${scenario.charAt(0).toUpperCase() + scenario.slice(1)} Scenario`, 30, yPosition);
          yPosition += 10;
          
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          const data = projections.scenarioAnalysis[scenario];
          doc.text(`Revenue: $${data.revenue?.toLocaleString() || 'N/A'}`, 40, yPosition);
          yPosition += 10;
          doc.text(`Probability: ${data.probability || 'N/A'}`, 40, yPosition);
          yPosition += 15;
        }
      });
    }
  }

  private addLaunchStrategyPages(doc: jsPDF, branding: any) {
    // Implementation for launch strategy report pages
    doc.addPage();
    let yPosition = 30;
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Launch Strategy', 20, yPosition);
    
    // Add launch strategy specific content
    yPosition += 20;
    // Implementation details...
  }

  private addComprehensivePages(doc: jsPDF, branding: any) {
    // Add all sections for comprehensive report
    this.addCompetitiveIntelligencePages(doc, branding);
    this.addMarketResearchPages(doc, branding);
    this.addRevenueProjectionPages(doc, branding);
    this.addLaunchStrategyPages(doc, branding);
  }

  private addAppendix(doc: jsPDF, branding: any) {
    doc.addPage();
    let yPosition = 30;
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Appendix', 20, yPosition);
    
    yPosition += 20;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Additional Resources and Data Sources', 20, yPosition);
    
    yPosition += 15;
    doc.text('• Market data sourced from industry reports and APIs', 30, yPosition);
    yPosition += 10;
    doc.text('• Competitive intelligence gathered from public sources', 30, yPosition);
    yPosition += 10;
    doc.text('• Financial projections based on industry benchmarks', 30, yPosition);
    yPosition += 10;
    doc.text('• Analysis powered by LaunchPilot AI', 30, yPosition);
  }

  // PowerPoint Helper Methods
  private addTitleSlide(pptx: any, branding: any) {
    const slide = pptx.addSlide();
    
    // Background
    slide.background = { fill: branding.primaryColor };
    
    // Title
    slide.addText('🚀 Business Analysis Report', {
      x: 1,
      y: 2,
      w: 8,
      h: 1.5,
      fontSize: 36,
      bold: true,
      color: 'FFFFFF',
      align: 'center'
    });
    
    // Project Name
    slide.addText(this.reportData.projectName, {
      x: 1,
      y: 3.5,
      w: 8,
      h: 1,
      fontSize: 28,
      bold: true,
      color: 'FFFFFF',
      align: 'center'
    });
    
    // Report Type
    slide.addText(this.formatReportType(this.reportData.type), {
      x: 1,
      y: 4.5,
      w: 8,
      h: 0.8,
      fontSize: 20,
      color: 'FFFFFF',
      align: 'center'
    });
    
    // Date
    const date = new Date(this.reportData.generatedAt).toLocaleDateString();
    slide.addText(`Generated on ${date}`, {
      x: 1,
      y: 5.5,
      w: 8,
      h: 0.5,
      fontSize: 16,
      color: 'FFFFFF',
      align: 'center'
    });
  }

  private addExecutiveSummarySlide(pptx: any, branding: any) {
    const slide = pptx.addSlide();
    
    // Title
    slide.addText('Executive Summary', {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 1,
      fontSize: 28,
      bold: true,
      color: branding.primaryColor
    });
    
    // Summary content
    const summary = this.generateExecutiveSummary();
    slide.addText(summary, {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 5,
      fontSize: 16,
      color: '333333',
      valign: 'top'
    });
  }

  private addCompetitiveIntelligenceSlides(pptx: any, branding: any) {
    if (!this.reportData.analysis.competitiveIntelligence) return;
    
    const slide = pptx.addSlide();
    
    slide.addText('Competitive Intelligence', {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 1,
      fontSize: 28,
      bold: true,
      color: branding.primaryColor
    });
    
    // Add competitive intelligence content
    const analysis = this.reportData.analysis.competitiveIntelligence;
    
    if (analysis.marketTrends) {
      slide.addText('Market Trends:', {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 0.5,
        fontSize: 18,
        bold: true,
        color: branding.secondaryColor
      });
      
      const trends = analysis.marketTrends.map((trend: any) => `• ${trend.trend}`).join('\n');
      slide.addText(trends, {
        x: 0.5,
        y: 2,
        w: 9,
        h: 3,
        fontSize: 14,
        color: '333333'
      });
    }
  }

  private addMarketResearchSlides(pptx: any, branding: any) {
    const slide = pptx.addSlide();
    
    slide.addText('Market Research Analysis', {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 1,
      fontSize: 28,
      bold: true,
      color: branding.primaryColor
    });
    
    // Add market research content
  }

  private addRevenueProjectionSlides(pptx: any, branding: any) {
    if (!this.reportData.analysis.revenueProjections) return;
    
    const slide = pptx.addSlide();
    
    slide.addText('Revenue Projections', {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 1,
      fontSize: 28,
      bold: true,
      color: branding.primaryColor
    });
    
    const projections = this.reportData.analysis.revenueProjections;
    
    if (projections.summary) {
      slide.addText('Revenue Summary:', {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 0.5,
        fontSize: 18,
        bold: true,
        color: branding.secondaryColor
      });
      
      const summaryText = [
        `Total Revenue: $${projections.summary.totalRevenue?.toLocaleString() || 'N/A'}`,
        `Monthly Average: $${projections.summary.monthlyAverage?.toLocaleString() || 'N/A'}`,
        `Required Leads: ${projections.summary.requiredLeads?.toLocaleString() || 'N/A'}`
      ].join('\n');
      
      slide.addText(summaryText, {
        x: 0.5,
        y: 2,
        w: 9,
        h: 2,
        fontSize: 16,
        color: '333333'
      });
    }
  }

  private addLaunchStrategySlides(pptx: any, branding: any) {
    const slide = pptx.addSlide();
    
    slide.addText('Launch Strategy', {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 1,
      fontSize: 28,
      bold: true,
      color: branding.primaryColor
    });
    
    // Add launch strategy content
  }

  private addComprehensiveSlides(pptx: any, branding: any) {
    // Add all slide types for comprehensive report
    this.addCompetitiveIntelligenceSlides(pptx, branding);
    this.addMarketResearchSlides(pptx, branding);
    this.addRevenueProjectionSlides(pptx, branding);
    this.addLaunchStrategySlides(pptx, branding);
  }

  private addRecommendationsSlide(pptx: any, branding: any) {
    const slide = pptx.addSlide();
    
    slide.addText('Recommendations & Next Steps', {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 1,
      fontSize: 28,
      bold: true,
      color: branding.primaryColor
    });
    
    // Add recommendations based on analysis
    const recommendations = this.generateRecommendations();
    slide.addText(recommendations, {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 5,
      fontSize: 16,
      color: '333333'
    });
  }

  private addClosingSlide(pptx: any, branding: any) {
    const slide = pptx.addSlide();
    
    slide.background = { fill: branding.primaryColor };
    
    slide.addText('Thank You', {
      x: 1,
      y: 2.5,
      w: 8,
      h: 1,
      fontSize: 36,
      bold: true,
      color: 'FFFFFF',
      align: 'center'
    });
    
    slide.addText('Questions? Contact LaunchPilot AI', {
      x: 1,
      y: 4,
      w: 8,
      h: 0.8,
      fontSize: 20,
      color: 'FFFFFF',
      align: 'center'
    });
  }

  // Utility Methods
  private hexToRgb(hex: string, alpha: number = 1): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0];
  }

  private formatReportType(type: string): string {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') + ' Report';
  }

  private formatCompetitorType(type: string): string {
    return type.replace(/([A-Z])/g, ' $1').trim()
      .split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  private getTableOfContentsEntries() {
    return [
      { title: 'Executive Summary', page: 3 },
      { title: 'Analysis Overview', page: 4 },
      { title: 'Key Findings', page: 5 },
      { title: 'Recommendations', page: 6 },
      { title: 'Appendix', page: 7 }
    ];
  }

  private generateExecutiveSummary(): string {
    // Generate summary based on available analysis data
    const summaryParts = [];
    
    if (this.reportData.analysis.competitiveIntelligence) {
      summaryParts.push('Competitive analysis reveals market opportunities and positioning strategies.');
    }
    
    if (this.reportData.analysis.revenueProjections) {
      const revenue = this.reportData.analysis.revenueProjections.summary?.totalRevenue;
      if (revenue) {
        summaryParts.push(`Revenue projections indicate potential for $${revenue.toLocaleString()} in total revenue.`);
      }
    }
    
    if (this.reportData.analysis.projectAnalysis) {
      const viability = this.reportData.analysis.projectAnalysis.analysis?.marketViability?.score;
      if (viability) {
        summaryParts.push(`Market viability assessment shows a score of ${viability}/10.`);
      }
    }
    
    return summaryParts.join(' ') || 'Comprehensive analysis of business opportunity and strategic recommendations.';
  }

  private generateRecommendations(): string {
    // Generate recommendations based on analysis
    const recommendations = [];
    
    if (this.reportData.analysis.projectAnalysis?.nextSteps) {
      this.reportData.analysis.projectAnalysis.nextSteps.forEach((step: any, index: number) => {
        recommendations.push(`${index + 1}. ${step.action} - ${step.details}`);
      });
    }
    
    if (recommendations.length === 0) {
      recommendations.push(
        '1. Conduct thorough market validation',
        '2. Develop minimum viable product (MVP)',
        '3. Build strategic partnerships',
        '4. Create comprehensive marketing strategy'
      );
    }
    
    return recommendations.join('\n');
  }
}

// Report Templates
export const reportTemplates = {
  competitiveIntelligence: {
    name: 'Competitive Intelligence Report',
    description: 'Comprehensive analysis of market competition and positioning',
    sections: [
      { title: 'Market Overview', type: 'text' },
      { title: 'Competitive Landscape', type: 'table' },
      { title: 'Market Trends', type: 'chart' },
      { title: 'Strategic Recommendations', type: 'recommendations' }
    ]
  },
  marketResearch: {
    name: 'Market Research Report',
    description: 'In-depth market analysis and opportunity assessment',
    sections: [
      { title: 'Market Size & Growth', type: 'metrics' },
      { title: 'Target Audience Analysis', type: 'text' },
      { title: 'Market Trends', type: 'chart' },
      { title: 'Opportunity Analysis', type: 'recommendations' }
    ]
  },
  revenueProjections: {
    name: 'Revenue Projections Report',
    description: 'Financial forecasting and revenue modeling',
    sections: [
      { title: 'Revenue Summary', type: 'metrics' },
      { title: 'Scenario Analysis', type: 'table' },
      { title: 'Growth Projections', type: 'chart' },
      { title: 'Financial Recommendations', type: 'recommendations' }
    ]
  },
  launchStrategy: {
    name: 'Launch Strategy Report',
    description: 'Comprehensive product/service launch planning',
    sections: [
      { title: 'Launch Timeline', type: 'timeline' },
      { title: 'Go-to-Market Strategy', type: 'text' },
      { title: 'Resource Requirements', type: 'table' },
      { title: 'Success Metrics', type: 'metrics' }
    ]
  },
  comprehensive: {
    name: 'Comprehensive Business Report',
    description: 'Complete business analysis including all aspects',
    sections: [
      { title: 'Executive Summary', type: 'text' },
      { title: 'Market Analysis', type: 'text' },
      { title: 'Competitive Intelligence', type: 'table' },
      { title: 'Financial Projections', type: 'chart' },
      { title: 'Launch Strategy', type: 'timeline' },
      { title: 'Recommendations', type: 'recommendations' }
    ]
  }
} as const; 