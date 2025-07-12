import { NextRequest, NextResponse } from 'next/server';
import { ReportGenerator, ReportData, reportTemplates } from '@/lib/report-generator';

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    
    // Validate required data
    if (!requestData.projectName || !requestData.analysis) {
      return NextResponse.json(
        { error: 'Missing required project data' },
        { status: 400 }
      );
    }

    // Extract parameters
    const {
      projectName,
      companyName,
      analysis,
      reportType = 'comprehensive',
      format = 'pdf',
      branding = {}
    } = requestData;

    // Validate report type
    if (!reportTemplates[reportType as keyof typeof reportTemplates]) {
      return NextResponse.json(
        { error: 'Invalid report type' },
        { status: 400 }
      );
    }

    // Validate format
    if (!['pdf', 'pptx'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format. Supported formats: pdf, pptx' },
        { status: 400 }
      );
    }

    // Prepare report data
    const reportData: ReportData = {
      type: reportType,
      projectName,
      companyName,
      analysis,
      generatedAt: new Date().toISOString(),
      branding: {
        primaryColor: branding.primaryColor || '#2563eb',
        secondaryColor: branding.secondaryColor || '#64748b',
        accentColor: branding.accentColor || '#059669',
        fontFamily: branding.fontFamily || 'Arial, sans-serif',
        logo: branding.logo || undefined
      }
    };

    // Generate report
    const reportGenerator = new ReportGenerator(reportData);
    let reportBuffer: Uint8Array;
    let contentType: string;
    let filename: string;

    if (format === 'pdf') {
      reportBuffer = await reportGenerator.generatePDF();
      contentType = 'application/pdf';
      filename = `${projectName.replace(/\s+/g, '_')}_${reportType}_report.pdf`;
    } else {
      reportBuffer = await reportGenerator.generatePPTX();
      contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      filename = `${projectName.replace(/\s+/g, '_')}_${reportType}_report.pptx`;
    }

    // Return the report
    return new NextResponse(reportBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': reportBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Report generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate report', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'templates') {
      // Return available report templates
      return NextResponse.json({
        templates: Object.entries(reportTemplates).map(([key, template]) => ({
          id: key,
          name: template.name,
          description: template.description,
          sections: template.sections.map(section => ({
            title: section.title,
            type: section.type
          }))
        }))
      });
    }

    if (action === 'formats') {
      // Return supported export formats
      return NextResponse.json({
        formats: [
          {
            id: 'pdf',
            name: 'PDF Document',
            description: 'Professional PDF report with charts and tables',
            contentType: 'application/pdf',
            extension: 'pdf'
          },
          {
            id: 'pptx',
            name: 'PowerPoint Presentation',
            description: 'Interactive PowerPoint slides for presentations',
            contentType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            extension: 'pptx'
          }
        ]
      });
    }

    if (action === 'branding-options') {
      // Return available branding customization options
      return NextResponse.json({
        options: {
          primaryColor: {
            type: 'color',
            label: 'Primary Color',
            default: '#2563eb',
            description: 'Main brand color for headers and accents'
          },
          secondaryColor: {
            type: 'color',
            label: 'Secondary Color',
            default: '#64748b',
            description: 'Secondary color for text and borders'
          },
          accentColor: {
            type: 'color',
            label: 'Accent Color',
            default: '#059669',
            description: 'Accent color for highlights and call-outs'
          },
          fontFamily: {
            type: 'select',
            label: 'Font Family',
            options: [
              { value: 'Arial, sans-serif', label: 'Arial' },
              { value: 'Helvetica, sans-serif', label: 'Helvetica' },
              { value: 'Times New Roman, serif', label: 'Times New Roman' },
              { value: 'Georgia, serif', label: 'Georgia' },
              { value: 'Roboto, sans-serif', label: 'Roboto' }
            ],
            default: 'Arial, sans-serif'
          },
          logo: {
            type: 'file',
            label: 'Company Logo',
            accept: 'image/*',
            description: 'Upload company logo (PNG, JPG, SVG)'
          }
        }
      });
    }

    // Default response with API information
    return NextResponse.json({
      message: 'LaunchPilot AI Report Generation API',
      version: '1.0.0',
      endpoints: {
        'POST /api/export': 'Generate and download reports',
        'GET /api/export?action=templates': 'Get available report templates',
        'GET /api/export?action=formats': 'Get supported export formats',
        'GET /api/export?action=branding-options': 'Get branding customization options'
      },
      supportedFormats: ['pdf', 'pptx'],
      supportedReportTypes: Object.keys(reportTemplates)
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 