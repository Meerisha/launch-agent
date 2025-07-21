"use client"

import React, { useState } from 'react';
import { Download, Share2, FileText, Presentation, Palette, Settings, X } from 'lucide-react';
import ReportGenerator from './ReportGenerator';

interface ShareButtonsProps {
  projectName: string;
  companyName?: string;
  analysis: any;
  onReportGenerated?: (reportData: any) => void;
}

export default function ShareButtons({ projectName, companyName, analysis, onReportGenerated }: ShareButtonsProps) {
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [showQuickExport, setShowQuickExport] = useState(false);

  const handleQuickExport = async (format: 'pdf' | 'pptx', reportType: string = 'comprehensive') => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName,
          companyName,
          analysis,
          reportType,
          format,
          branding: {
            primaryColor: '#2563eb',
            secondaryColor: '#64748b',
            accentColor: '#059669',
            fontFamily: 'Arial, sans-serif'
          }
        })
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName.replace(/\s+/g, '_')}_${reportType}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      if (onReportGenerated) {
        onReportGenerated({ format, reportType, filename: a.download });
      }
    } catch (error) {
      console.error('Quick export failed:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${projectName} - Business Analysis`,
          text: `Check out this business analysis for ${projectName}`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.error('Copy failed:', error);
      }
    }
  };

  if (!projectName || !analysis) {
    return null;
  }

  return (
    <>
      <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 text-gray-700">
          <Share2 className="w-4 h-4" />
          <span className="text-sm font-medium">Share & Export:</span>
        </div>

        {/* Quick Export Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleQuickExport('pdf')}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
            title="Quick PDF Export"
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>
          
          <button
            onClick={() => handleQuickExport('pptx')}
            className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition-colors"
            title="Quick PowerPoint Export"
          >
            <Presentation className="w-4 h-4" />
            PPT
          </button>
        </div>

        {/* Advanced Export */}
        <button
          onClick={() => setShowReportGenerator(true)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          <Palette className="w-4 h-4" />
          Custom Report
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>

        {/* Quick Export Menu */}
        {showQuickExport && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Quick Export</h3>
                <button
                  onClick={() => setShowQuickExport(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => handleQuickExport('pdf', 'competitive-intelligence')}
                  className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 rounded"
                >
                  <span className="text-sm">Competitive Intelligence PDF</span>
                  <FileText className="w-4 h-4 text-red-500" />
                </button>
                
                <button
                  onClick={() => handleQuickExport('pptx', 'revenue-projections')}
                  className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 rounded"
                >
                  <span className="text-sm">Revenue Projections PPT</span>
                  <Presentation className="w-4 h-4 text-orange-500" />
                </button>
                
                <button
                  onClick={() => handleQuickExport('pdf', 'launch-strategy')}
                  className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 rounded"
                >
                  <span className="text-sm">Launch Strategy PDF</span>
                  <FileText className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Report Generator Modal */}
      {showReportGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Generate Custom Report</h2>
              <button
                onClick={() => setShowReportGenerator(false)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <ReportGenerator
                projectName={projectName}
                companyName={companyName}
                analysis={analysis}
                onReportGenerated={(reportData) => {
                  if (onReportGenerated) {
                    onReportGenerated(reportData);
                  }
                  setShowReportGenerator(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
} 