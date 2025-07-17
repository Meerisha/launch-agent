import { NextRequest, NextResponse } from 'next/server'
import { getServerAuthSession } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  data: z.object({
    projectName: z.string(),
    elevatorPitch: z.string(),
    targetAudience: z.string(),
    launchGoal: z.string(),
    riskTolerance: z.string().optional(),
    launchWindow: z.string().optional(),
    creatorSkills: z.string().optional(),
    existingAssets: z.string().optional(),
    constraints: z.string().optional(),
  }),
  analysis: z.any().optional(),
  status: z.enum(['draft', 'in_progress', 'completed', 'archived']).default('draft'),
})

const UpdateProjectSchema = CreateProjectSchema.partial()

// GET /api/projects - List user's projects
export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('projects')
      .select('*')
      .eq('user_id', session.user.id)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: projects, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      projects: projects || [],
      pagination: {
        limit,
        offset,
        total: projects?.length || 0,
      },
    })
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = CreateProjectSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { name, description, data, analysis, status } = validation.data

    const { data: project, error } = await supabase
      .from('projects')
      .insert([
        {
          user_id: session.user.id,
          name,
          description,
          data,
          analysis,
          status,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      project,
    }, { status: 201 })
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 