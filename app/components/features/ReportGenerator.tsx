"use client"

import React, { useState, useEffect } from 'react';
import { 
  Download, 
  FileText, 
  Presentation, 
  Palette, 
  Settings, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  Sparkles
} from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: Array<{
    title: string;
    type: string;
  }>;
}

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  contentType: string;
  extension: string;
}

interface BrandingOption {
  type: 'color' | 'select' | 'file';
  label: string;
  default?: string;
  options?: Array<{ value: string; label: string }>;
  accept?: string;
  description?: string;
}

interface BrandingOptions {
  [key: string]: BrandingOption;
}

interface ReportGeneratorProps {
  projectName: string;
  companyName?: string;
  analysis: any;
  onReportGenerated?: (reportData: any) => void;
}

export default function ReportGenerator({ 
  projectName, 
  companyName, 
  analysis, 
  onReportGenerated 
}: ReportGeneratorProps) {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [formats, setFormats] = useState<ExportFormat[]>([]);
  const [brandingOptions, setBrandingOptions] = useState<BrandingOptions>({});
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>('comprehensive');
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');
  const [branding, setBranding] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load templates, formats, and branding options
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [templatesRes, formatsRes, brandingRes] = await Promise.all([
          fetch('/api/export?action=templates'),
          fetch('/api/export?action=formats'),
          fetch('/api/export?action=branding-options')
        ]);

        const templatesData = await templatesRes.json();
        const formatsData = await formatsRes.json();
        const brandingData = await brandingRes.json();

        setTemplates(templatesData.templates || []);
        setFormats(formatsData.formats || []);
        setBrandingOptions(brandingData.options || {});

        // Set default branding values
        const defaultBranding: Record<string, any> = {};
        Object.entries(brandingData.options || {}).forEach(([key, option]) => {
          if (option && typeof option === 'object' && 'default' in option) {
            defaultBranding[key] = (option as any).default;
          }
        });
        setBranding(defaultBranding);

      } catch (error) {
        console.error('Failed to load options:', error);
        setError('Failed to load report options');
      }
    };

    loadOptions();
  }, []);

  const handleBrandingChange = (key: string, value: any) => {
    setBranding(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFileUpload = (key: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      handleBrandingChange(key, e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const generateReport = async () => {
    if (!projectName || !analysis) {
      setError('Missing required project data');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(null);

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
          reportType: selectedTemplate,
          format: selectedFormat,
          branding
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate report');
      }

      // Get the filename from the response headers
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `${projectName.replace(/\s+/g, '_')}_report.${selectedFormat}`;

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(`Report generated successfully! Download should start automatically.`);
      
      if (onReportGenerated) {
        onReportGenerated({
          template: selectedTemplate,
          format: selectedFormat,
          filename,
          branding
        });
      }

    } catch (error) {
      console.error('Report generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);
  const selectedFormatData = formats.find(f => f.id === selectedFormat);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-full">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Generate Report</h2>
          <p className="text-gray-600">Create professional, branded reports from your analysis</p>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Report Template</h3>
          </div>
          
          <div className="space-y-2">
            {templates.map((template) => (
              <label 
                key={template.id}
                className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="template"
                  value={template.id}
                  checked={selectedTemplate === template.id}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                  {selectedTemplate === template.id && (
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  )}
                </div>
              </label>
            ))}
          </div>

          {/* Template Preview */}
          {selectedTemplateData && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Template Sections:</h4>
              <div className="space-y-1">
                {selectedTemplateData.sections.map((section, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-gray-700">{section.title}</span>
                    <span className="text-gray-500">({section.type})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Format & Branding */}
        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Export Format</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {formats.map((format) => (
                <label 
                  key={format.id}
                  className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedFormat === format.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="format"
                    value={format.id}
                    checked={selectedFormat === format.id}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {format.id === 'pdf' ? (
                        <FileText className="w-5 h-5 text-red-500" />
                      ) : (
                        <Presentation className="w-5 h-5 text-orange-500" />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900">{format.name}</h4>
                        <p className="text-sm text-gray-600">{format.description}</p>
                      </div>
                    </div>
                    {selectedFormat === format.id && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Branding Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Branding</h3>
            </div>
            
            <div className="space-y-4">
              {Object.entries(brandingOptions).map(([key, option]) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {option.label}
                  </label>
                  
                  {option.type === 'color' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={branding[key] || option.default}
                        onChange={(e) => handleBrandingChange(key, e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={branding[key] || option.default}
                        onChange={(e) => handleBrandingChange(key, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="#000000"
                      />
                    </div>
                  )}
                  
                  {option.type === 'select' && (
                    <select
                      value={branding[key] || option.default}
                      onChange={(e) => handleBrandingChange(key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {option.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  {option.type === 'file' && (
                    <input
                      type="file"
                      accept={option.accept}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(key, file);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                  
                  {option.description && (
                    <p className="text-xs text-gray-500">{option.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview & Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Hide Preview' : 'Preview Settings'}
            </button>
          </div>
          
          <button
            onClick={generateReport}
            disabled={isGenerating || !projectName || !analysis}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Generate Report
              </>
            )}
          </button>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Report Preview</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Project:</strong> {projectName}
              </div>
              <div>
                <strong>Company:</strong> {companyName || 'Not specified'}
              </div>
              <div>
                <strong>Template:</strong> {selectedTemplateData?.name}
              </div>
              <div>
                <strong>Format:</strong> {selectedFormatData?.name}
              </div>
              <div>
                <strong>Primary Color:</strong> 
                <span 
                  className="inline-block w-4 h-4 rounded ml-2 border"
                  style={{ backgroundColor: branding.primaryColor }}
                ></span>
              </div>
              <div>
                <strong>Font Family:</strong> {branding.fontFamily}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 