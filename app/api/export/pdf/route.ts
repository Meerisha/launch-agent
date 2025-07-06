import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required data
    if (!data.projectName || !data.analysis) {
      return NextResponse.json(
        { error: 'Missing required project data' },
        { status: 400 }
      );
    }

    // Create new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 30;

    // Helper function to add text with word wrapping
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 12) => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + (lines.length * (fontSize * 0.4));
    };

    // Helper function to check if we need a new page
    const checkNewPage = (currentY: number, neededSpace: number = 20) => {
      if (currentY + neededSpace > pageHeight - 30) {
        doc.addPage();
        return 30;
      }
      return currentY;
    };

    // Cover Page
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    yPosition = addWrappedText('🚀 Launch Strategy Report', 20, yPosition, pageWidth - 40, 24);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    yPosition = addWrappedText('AI-Powered Business Launch Analysis', 20, yPosition + 10, pageWidth - 40, 14);

    // Project Name Box
    yPosition += 20;
    doc.setFillColor(219, 234, 254); // Light blue background
    doc.rect(20, yPosition - 5, pageWidth - 40, 25, 'F');
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    yPosition = addWrappedText(data.projectName, 30, yPosition + 10, pageWidth - 60, 18);

    // Generation Date
    yPosition += 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const generationDate = new Date(data.generatedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    yPosition = addWrappedText(`Generated on ${generationDate}`, 30, yPosition, pageWidth - 60, 12);

    // Executive Summary
    yPosition += 20;
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    yPosition = addWrappedText('Executive Summary', 20, yPosition, pageWidth - 40, 18);

    // Revenue Highlight
    yPosition += 15;
    doc.setFillColor(240, 253, 244); // Light green background
    doc.rect(20, yPosition - 5, pageWidth - 40, 30, 'F');
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    const totalRevenue = `$${data.analysis.revenueProjections.summary.totalRevenue.toLocaleString()}`;
    yPosition = addWrappedText(totalRevenue, 30, yPosition + 10, pageWidth - 60, 20);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    yPosition = addWrappedText('Projected Total Revenue', 30, yPosition + 5, pageWidth - 60, 12);

    // Market Viability
    yPosition += 25;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    yPosition = addWrappedText(`Market Viability Score: ${data.analysis.projectAnalysis.analysis.marketViability.score}`, 20, yPosition, pageWidth - 40, 14);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    yPosition = addWrappedText(data.analysis.projectAnalysis.analysis.marketViability.reasoning, 20, yPosition + 5, pageWidth - 40, 12);

    // Recommended Approach
    yPosition += 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    yPosition = addWrappedText('Recommended Approach:', 20, yPosition, pageWidth - 40, 14);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    yPosition = addWrappedText(data.analysis.projectAnalysis.analysis.recommendedApproach, 20, yPosition + 5, pageWidth - 40, 12);

    // Page 2 - Detailed Analysis
    doc.addPage();
    yPosition = 30;

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    yPosition = addWrappedText('Detailed Analysis', 20, yPosition, pageWidth - 40, 20);

    // Resource Assessment
    yPosition += 20;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    yPosition = addWrappedText('Resource Assessment', 20, yPosition, pageWidth - 40, 16);

    yPosition += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    yPosition = addWrappedText('Team Strength:', 20, yPosition, pageWidth - 40, 12);
    doc.setFont('helvetica', 'normal');
    yPosition = addWrappedText(data.analysis.projectAnalysis.analysis.resourceAssessment.teamStrength, 20, yPosition + 3, pageWidth - 40, 12);

    yPosition += 10;
    doc.setFont('helvetica', 'bold');
    yPosition = addWrappedText('Technical Capability:', 20, yPosition, pageWidth - 40, 12);
    doc.setFont('helvetica', 'normal');
    yPosition = addWrappedText(data.analysis.projectAnalysis.analysis.resourceAssessment.technicalCapability, 20, yPosition + 3, pageWidth - 40, 12);

    yPosition += 10;
    doc.setFont('helvetica', 'bold');
    yPosition = addWrappedText('Content Readiness:', 20, yPosition, pageWidth - 40, 12);
    doc.setFont('helvetica', 'normal');
    yPosition = addWrappedText(data.analysis.projectAnalysis.analysis.resourceAssessment.contentReadiness, 20, yPosition + 3, pageWidth - 40, 12);

    // Risk Factors
    yPosition = checkNewPage(yPosition + 15);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    yPosition = addWrappedText('Risk Factors', 20, yPosition, pageWidth - 40, 16);

    yPosition += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    data.analysis.projectAnalysis.analysis.riskFactors.factors.forEach((factor: string) => {
      yPosition = checkNewPage(yPosition);
      yPosition = addWrappedText(`• ${factor}`, 30, yPosition, pageWidth - 50, 12);
      yPosition += 5;
    });

    // Next Steps
    yPosition = checkNewPage(yPosition + 10);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    yPosition = addWrappedText('Immediate Next Steps', 20, yPosition, pageWidth - 40, 16);

    yPosition += 10;
    data.analysis.projectAnalysis.nextSteps.forEach((step: any, index: number) => {
      yPosition = checkNewPage(yPosition);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      yPosition = addWrappedText(`${step.priority}. ${step.action}`, 20, yPosition, pageWidth - 40, 12);
      doc.setFont('helvetica', 'normal');
      yPosition = addWrappedText(`${step.details} (${step.timeline})`, 30, yPosition + 3, pageWidth - 50, 12);
      yPosition += 10;
    });

    // Page 3 - Revenue Projections
    doc.addPage();
    yPosition = 30;

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    yPosition = addWrappedText('Revenue Projections', 20, yPosition, pageWidth - 40, 20);

    // Revenue Summary Table
    yPosition += 20;
    doc.setFontSize(16);
    yPosition = addWrappedText('Revenue Summary', 20, yPosition, pageWidth - 40, 16);

    yPosition += 15;
    const tableData = [
      ['Total Revenue', `$${data.analysis.revenueProjections.summary.totalRevenue.toLocaleString()}`],
      ['Monthly Average', `$${data.analysis.revenueProjections.summary.monthlyAverage.toLocaleString()}`],
      ['Required Leads', data.analysis.revenueProjections.summary.requiredLeads.toLocaleString()],
    ];

    // Draw table
    const tableY = yPosition;
    const rowHeight = 12;
    const colWidth = (pageWidth - 40) / 2;

    tableData.forEach((row, index) => {
      const currentY = tableY + (index * rowHeight);
      
      // Draw row background for even rows
      if (index % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(20, currentY - 3, pageWidth - 40, rowHeight, 'F');
      }
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(row[0], 25, currentY + 5);
      doc.text(row[1], 25 + colWidth, currentY + 5);
    });

    yPosition = tableY + (tableData.length * rowHeight) + 15;

    // Break-even Analysis
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    yPosition = addWrappedText('Break-even Analysis', 20, yPosition, pageWidth - 40, 16);

    yPosition += 10;
    doc.setFontSize(12);
    yPosition = addWrappedText(`Break-even Units: ${data.analysis.revenueProjections.breakEvenAnalysis.breakEvenUnits}`, 20, yPosition, pageWidth - 40, 12);
    yPosition = addWrappedText(`Time to Break-even: ${data.analysis.revenueProjections.breakEvenAnalysis.timeToBreakEven} months`, 20, yPosition + 5, pageWidth - 40, 12);
    yPosition = addWrappedText(`Profit Margin: ${data.analysis.revenueProjections.breakEvenAnalysis.profitMargin}%`, 20, yPosition + 10, pageWidth - 40, 12);

    // Scenario Analysis
    yPosition += 25;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    yPosition = addWrappedText('Scenario Analysis', 20, yPosition, pageWidth - 40, 16);

    yPosition += 15;
    const scenarioData = [
      ['Conservative (70%)', `$${data.analysis.revenueProjections.scenarioAnalysis.conservative.revenue.toLocaleString()}`],
      ['Realistic (50%)', `$${data.analysis.revenueProjections.scenarioAnalysis.realistic.revenue.toLocaleString()}`],
      ['Optimistic (20%)', `$${data.analysis.revenueProjections.scenarioAnalysis.optimistic.revenue.toLocaleString()}`],
    ];

    const scenarioTableY = yPosition;
    scenarioData.forEach((row, index) => {
      const currentY = scenarioTableY + (index * rowHeight);
      
      if (index % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(20, currentY - 3, pageWidth - 40, rowHeight, 'F');
      }
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(row[0], 25, currentY + 5);
      doc.text(row[1], 25 + colWidth, currentY + 5);
    });

    // Page 4 - Launch Strategy
    doc.addPage();
    yPosition = 30;

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    yPosition = addWrappedText('Launch Strategy', 20, yPosition, pageWidth - 40, 20);

    // Timeline
    yPosition += 20;
    doc.setFontSize(16);
    yPosition = addWrappedText('Launch Timeline', 20, yPosition, pageWidth - 40, 16);

    yPosition += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    yPosition = addWrappedText(`Total Duration: ${data.analysis.launchStrategy.timeline.totalWeeks} weeks`, 20, yPosition, pageWidth - 40, 12);

    yPosition += 15;
    data.analysis.launchStrategy.timeline.phases.forEach((phase: any, index: number) => {
      yPosition = checkNewPage(yPosition);
      doc.setFont('helvetica', 'bold');
      yPosition = addWrappedText(`${index + 1}. ${phase.phase}`, 20, yPosition, pageWidth - 40, 12);
      doc.setFont('helvetica', 'normal');
      yPosition = addWrappedText(`${phase.duration} weeks`, 30, yPosition + 3, pageWidth - 50, 12);
      yPosition += 10;
    });

    // Budget Allocation
    yPosition = checkNewPage(yPosition + 10);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    yPosition = addWrappedText('Budget Allocation', 20, yPosition, pageWidth - 40, 16);

    yPosition += 10;
    doc.setFontSize(12);
    yPosition = addWrappedText(`Total Budget: $${data.analysis.launchStrategy.budgetAllocation.total.toLocaleString()}`, 20, yPosition, pageWidth - 40, 12);

    yPosition += 15;
    Object.entries(data.analysis.launchStrategy.budgetAllocation.breakdown).forEach(([category, amount]: [string, any]) => {
      yPosition = checkNewPage(yPosition);
      doc.setFont('helvetica', 'normal');
      yPosition = addWrappedText(`${category.charAt(0).toUpperCase() + category.slice(1)}: $${amount.toLocaleString()}`, 30, yPosition, pageWidth - 50, 12);
      yPosition += 8;
    });

    // Footer on last page
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated by LaunchPilot AI • https://launch-agent.vercel.app', 20, pageHeight - 20);

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    // Set up filename
    const fileName = `LaunchStrategy_${data.projectName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Return PDF as download
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
    
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF report' },
      { status: 500 }
    );
  }
} 