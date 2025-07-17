"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Save, Check, AlertCircle, LogIn } from 'lucide-react'
import Link from 'next/link'

interface SaveProjectButtonProps {
  projectData: {
    projectName: string
    elevatorPitch: string
    targetAudience: string
    launchGoal: string
    riskTolerance?: string
    launchWindow?: string
    creatorSkills?: string
    existingAssets?: string
    constraints?: string
  }
  analysis?: any
  onSaved?: (projectId: string) => void
}

export default function SaveProjectButton({ projectData, analysis, onSaved }: SaveProjectButtonProps) {
  const { data: session } = useSession()
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const saveProject = async () => {
    if (!session) return

    setIsSaving(true)
    setError('')

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectData.projectName,
          description: projectData.elevatorPitch,
          data: projectData,
          analysis: analysis,
          status: analysis ? 'completed' : 'draft',
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSaveStatus('success')
        if (onSaved) {
          onSaved(data.project.id)
        }
        // Reset success status after 3 seconds
        setTimeout(() => setSaveStatus('idle'), 3000)
      } else {
        setError(data.error || 'Failed to save project')
        setSaveStatus('error')
      }
    } catch (error) {
      setError('Failed to save project')
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  if (!session) {
    return (
      <div className="flex items-center space-x-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <LogIn className="h-5 w-5 text-blue-600" />
        <span className="text-sm text-blue-800">
          <Link href="/auth/signin" className="font-medium hover:underline">
            Sign in
          </Link>{' '}
          to save your projects and access them later
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={saveProject}
        disabled={isSaving || saveStatus === 'success'}
        className={`
          flex items-center px-4 py-2 rounded-lg font-medium transition-colors
          ${saveStatus === 'success' 
            ? 'bg-green-100 text-green-800 cursor-default' 
            : saveStatus === 'error'
            ? 'bg-red-100 text-red-800 hover:bg-red-200'
            : 'bg-blue-600 text-white hover:bg-blue-700'
          }
          ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isSaving ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            Saving...
          </>
        ) : saveStatus === 'success' ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            Saved!
          </>
        ) : saveStatus === 'error' ? (
          <>
            <AlertCircle className="h-4 w-4 mr-2" />
            Try Again
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Save Project
          </>
        )}
      </button>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {saveStatus === 'success' && (
        <p className="text-sm text-green-600">
          Project saved! View it in your{' '}
          <Link href="/dashboard" className="font-medium hover:underline">
            dashboard
          </Link>
        </p>
      )}
    </div>
  )
} 