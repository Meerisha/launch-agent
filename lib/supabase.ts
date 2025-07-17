import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client for API routes
export function createServerSupabaseClient(request: NextRequest, response: NextResponse) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        request.cookies.set({
          name,
          value,
          ...options,
        })
        response.cookies.set({
          name,
          value,
          ...options,
        })
      },
      remove(name: string, options: any) {
        request.cookies.set({
          name,
          value: '',
          ...options,
        })
        response.cookies.set({
          name,
          value: '',
          ...options,
        })
      },
    },
  })
}

// Database Types
export interface User {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  data: {
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
  analysis: any | null
  status: 'draft' | 'in_progress' | 'completed' | 'archived'
  created_at: string
  updated_at: string
}

export interface ChatConversation {
  id: string
  user_id: string
  project_id: string | null
  title: string
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: string
  }>
  context: any | null
  created_at: string
  updated_at: string
}

export interface FinancialModel {
  id: string
  user_id: string
  project_id: string
  name: string
  data: {
    productType: string
    pricePoint: number
    subscriptionType: string
    targetCustomers: number
    conversionRate: number
    churnRate: number
    acquisitionCost: number
    lifetimeValueMultiplier: number
    upsellRate: number
    upsellAmount: number
    fixedCosts: number
    variableCostPercentage: number
    marketingBudget: number
    timeframe: number
    monthlyGrowthRate: number
    seasonalityFactor: number
  }
  calculations: any | null
  created_at: string
  updated_at: string
} 