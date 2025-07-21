'use client';

import React, { useState } from 'react';
import { Download, Copy, Loader2, Sparkles } from 'lucide-react';

interface GeneratedImage {
  url: string;
  prompt: string;
  revisedPrompt: string;
  format: string;
}

interface ImageResult {
  project: string;
  postType: string;
  images: GeneratedImage[];
  suggestions: {
    bestTimeToPost: string;
    engagementTips: string[];
    contentSeries: string;
    crossPlatform: string;
  };
  hashtags: string[];
  captions: Array<{
    type: string;
    text: string;
    length: number;
  }>;
}

export default function InstagramImageGenerator() {
  const [formData, setFormData] = useState({
    projectName: '',
    postType: 'product-showcase',
    contentText: '',
    brandColors: '',
    style: 'modern',
    targetAudience: '',
    includeText: true,
    aspectRatio: 'square'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ImageResult | null>(null);
  const [selectedCaption, setSelectedCaption] = useState(0);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'generate_instagram_images',
            arguments: formData
          }
        })
      });

      const data = await response.json();
      const imageResult = JSON.parse(data.result.content[0].text);
      setResult(imageResult);
    } catch (error) {
      console.error('Error generating images:', error);
      alert('Failed to generate images. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try right-clicking and saving manually.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          <Sparkles className="inline-block w-8 h-8 mr-2 text-purple-600" />
          Instagram Image Generator
        </h1>
        <p className="text-gray-600">Create stunning AI-powered Instagram posts for your product launch</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={formData.projectName}
              onChange={(e) => setFormData({...formData, projectName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="My Awesome App"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Type
            </label>
            <select
              value={formData.postType}
              onChange={(e) => setFormData({...formData, postType: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="product-showcase">Product Showcase</option>
              <option value="behind-the-scenes">Behind the Scenes</option>
              <option value="educational">Educational</option>
              <option value="testimonial">Testimonial</option>
              <option value="announcement">Announcement</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="quote-post">Quote Post</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Message
            </label>
            <textarea
              value={formData.contentText}
              onChange={(e) => setFormData({...formData, contentText: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
              placeholder="Track your fitness goals with our new AI-powered app!"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Colors
            </label>
            <input
              type="text"
              value={formData.brandColors}
              onChange={(e) => setFormData({...formData, brandColors: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="blue and orange"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visual Style
            </label>
            <select
              value={formData.style}
              onChange={(e) => setFormData({...formData, style: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="minimalist">Minimalist</option>
              <option value="modern">Modern</option>
              <option value="corporate">Corporate</option>
              <option value="playful">Playful</option>
              <option value="elegant">Elegant</option>
              <option value="tech">Tech</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience
            </label>
            <input
              type="text"
              value={formData.targetAudience}
              onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="fitness enthusiasts"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aspect Ratio
            </label>
            <select
              value={formData.aspectRatio}
              onChange={(e) => setFormData({...formData, aspectRatio: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="square">Square (1:1) - Feed Post</option>
              <option value="portrait">Portrait (9:16) - Reels/Stories</option>
              <option value="story">Story (9:16) - Stories</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.includeText}
              onChange={(e) => setFormData({...formData, includeText: e.target.checked})}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="ml-2 text-sm text-gray-700">Include text overlay on images</span>
          </label>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !formData.projectName || !formData.contentText || !formData.targetAudience}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Images
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Generated Images */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Generated Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.images.map((image, index) => (
                <div key={index} className="space-y-3">
                  <div className="relative">
                    <img
                      src={image.url}
                      alt={`Generated Instagram post ${index + 1}`}
                      className="w-full rounded-lg shadow-md"
                    />
                    <button
                      onClick={() => downloadImage(image.url, `${result.project}-instagram-${index + 1}.png`)}
                      className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">{image.revisedPrompt}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Captions & Hashtags */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ready-to-Use Captions</h3>
              <div className="space-y-4">
                {result.captions.map((caption, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {caption.type} ({caption.length} chars)
                      </span>
                      <button
                        onClick={() => copyToClipboard(caption.text)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{caption.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Hashtags & Strategy</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Optimized Hashtags</h4>
                  <div className="flex flex-wrap gap-1">
                    {result.hashtags.map((tag, index) => (
                      <span key={index} className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => copyToClipboard(result.hashtags.join(' '))}
                    className="mt-2 text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copy all hashtags
                  </button>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Best Time to Post</h4>
                  <p className="text-sm text-gray-600">{result.suggestions.bestTimeToPost}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Engagement Tips</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {result.suggestions.engagementTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 