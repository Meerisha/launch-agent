"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Archive
} from 'lucide-react'
import Link from 'next/link'
import { Project } from '@/lib/supabase'

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  archived: 'bg-yellow-100 text-yellow-800',
}

const statusIcons = {
  draft: AlertCircle,
  in_progress: Clock,
  completed: CheckCircle,
  archived: Archive,
}

export default function ProjectHistory() {
  const { data: session } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])

  // Fetch projects
  useEffect(() => {
    if (session?.user?.id) {
      fetchProjects()
    }
  }, [session, statusFilter])

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const url = statusFilter === 'all' 
        ? '/api/projects' 
        : `/api/projects?status=${statusFilter}`
      
      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setProjects(data.projects)
      } else {
        setError(data.error || 'Failed to fetch projects')
      }
    } catch (error) {
      setError('Failed to fetch projects')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== projectId))
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete project')
      }
    } catch (error) {
      setError('Failed to delete project')
    }
  }

  const updateProjectStatus = async (projectId: string, newStatus: Project['status']) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const data = await response.json()
        setProjects(projects.map(p => p.id === projectId ? data.project : p))
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update project')
      }
    } catch (error) {
      setError('Failed to update project')
    }
  }

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.data.elevatorPitch.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in to view your projects</h3>
        <p className="text-gray-600">Access your saved projects and launch analyses</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project History</h2>
          <p className="text-gray-600">Manage and track your launch projects</p>
        </div>
        <Link 
          href="/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Project
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Projects List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No projects found' : 'No projects yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? 'Try adjusting your search or filters' 
              : 'Create your first project to get started with LaunchPilot'
            }
          </p>
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredProjects.map((project) => {
            const StatusIcon = statusIcons[project.status]
            return (
              <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusColors[project.status]}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{project.data.elevatorPitch}</p>
                    
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Created {formatDate(project.created_at)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Updated {formatDate(project.updated_at)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => window.open(`/?project=${project.id}`, '_blank')}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Project"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    
                    <div className="relative group">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <Edit3 className="h-5 w-5" />
                      </button>
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <div className="p-1">
                          {(['draft', 'in_progress', 'completed', 'archived'] as const).map((status) => (
                            <button
                              key={status}
                              onClick={() => updateProjectStatus(project.id, status)}
                              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                project.status === status 
                                  ? 'bg-blue-50 text-blue-700' 
                                  : 'hover:bg-gray-50 text-gray-700'
                              }`}
                            >
                              Mark as {status.replace('_', ' ')}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
} 