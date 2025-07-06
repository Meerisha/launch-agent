"use client"

import React, { useState, useEffect } from 'react'

interface ShareButtonsProps {
  projectName: string
  results: any
}

export default function ShareButtons({ projectName, results }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [hasNativeShare, setHasNativeShare] = useState(false)

  useEffect(() => {
    setHasNativeShare(typeof navigator !== 'undefined' && 'share' in navigator)
  }, [])

  // Generate shareable content
  const shareTitle = `🚀 Launch Strategy for ${projectName}`
  const shareText = `Check out my AI-generated launch strategy for ${projectName}! 
  
💰 Revenue Goal: $${results.analysis.revenueProjections.summary.totalRevenue.toLocaleString()}
📊 Monthly Average: $${results.analysis.revenueProjections.summary.monthlyAverage.toLocaleString()}
🎯 Market Score: ${results.analysis.projectAnalysis.analysis.marketViability.score}

Generated with LaunchPilot AI`

  const shareData = {
    title: shareTitle,
    text: shareText,
    url: typeof window !== 'undefined' ? window.location.href : ''
  }

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareData.url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Generate shareable link
  const generateShareableLink = () => {
    const data = {
      projectName,
      summary: {
        totalRevenue: results.analysis.revenueProjections.summary.totalRevenue,
        monthlyAverage: results.analysis.revenueProjections.summary.monthlyAverage,
        marketScore: results.analysis.projectAnalysis.analysis.marketViability.score,
        approach: results.analysis.projectAnalysis.analysis.recommendedApproach
      }
    }
    
    const encodedData = btoa(JSON.stringify(data))
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const shareUrl = `${baseUrl}/share/${encodedData}`
    
    return shareUrl
  }

  // Social sharing functions
  const shareOnTwitter = () => {
    const twitterText = `🚀 Just got my AI-generated launch strategy for ${projectName}!

💰 Revenue Goal: $${results.analysis.revenueProjections.summary.totalRevenue.toLocaleString()}
📊 Monthly Avg: $${results.analysis.revenueProjections.summary.monthlyAverage.toLocaleString()}
🎯 Market Score: ${results.analysis.projectAnalysis.analysis.marketViability.score}

Try it yourself:`
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareData.url)}`
    window.open(twitterUrl, '_blank')
  }

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`
    window.open(linkedInUrl, '_blank')
  }

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`
    window.open(facebookUrl, '_blank')
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(shareTitle)
    const body = encodeURIComponent(`${shareText}\n\nView full analysis: ${shareData.url}`)
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`
    window.open(mailtoUrl)
  }

  // Native share (mobile)
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.error('Error sharing:', err)
      }
    }
  }

  // PDF Export
  const handlePDFExport = async () => {
    try {
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(results)
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `LaunchStrategy_${projectName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('PDF export failed:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  // Email Export
  const handleEmailExport = () => {
    const subject = encodeURIComponent(`Launch Strategy Report - ${projectName}`)
    const body = encodeURIComponent(`Hi,

I've generated a comprehensive launch strategy for my project "${projectName}" using LaunchPilot AI.

Here are the key highlights:
• Total Revenue Goal: $${results.analysis.revenueProjections.summary.totalRevenue.toLocaleString()}
• Monthly Average: $${results.analysis.revenueProjections.summary.monthlyAverage.toLocaleString()}
• Market Viability Score: ${results.analysis.projectAnalysis.analysis.marketViability.score}

Recommended Approach: ${results.analysis.projectAnalysis.analysis.recommendedApproach}

You can generate your own launch strategy at: ${typeof window !== 'undefined' ? window.location.origin : ''}

Best regards`)
    
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`
    window.open(mailtoUrl)
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Share Your Launch Strategy</h3>
        
        {/* Social Share Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <button
            onClick={shareOnTwitter}
            className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            Twitter
          </button>
          
          <button
            onClick={shareOnLinkedIn}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </button>
          
          <button
            onClick={shareOnFacebook}
            className="flex items-center px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
          
          <button
            onClick={shareViaEmail}
            className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
            </svg>
            Email
          </button>
        </div>

        {/* Copy Link Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={copyToClipboard}
            className={`flex items-center px-4 py-2 ${
              copied ? 'bg-green-500' : 'bg-slate-600 hover:bg-slate-700'
            } text-white rounded-lg transition-colors`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
                Copy Link
              </>
            )}
          </button>
        </div>

        {/* Native Share (Mobile) */}
        {hasNativeShare && (
          <div className="flex justify-center mb-4">
            <button
              onClick={nativeShare}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
              </svg>
              Share
            </button>
          </div>
        )}

        {/* Export Options */}
        <div className="flex justify-center gap-3">
          <button
            onClick={handlePDFExport}
            className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
            Export PDF
          </button>
          
          <button
            onClick={handleEmailExport}
            className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            Email Report
          </button>
        </div>
      </div>
    </div>
  )
} 