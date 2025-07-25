# Vercel Deployment Guide

This guide will help you successfully deploy LaunchPilot to Vercel.

## ✅ Build Issues Fixed

The following TypeScript errors have been resolved:
- **API Route Types**: Fixed Next.js 15 route handler parameter types in `app/api/projects/[id]/route.ts`
- **Component Props**: Fixed `SampleProjectSelector` and `ShareButtons` component prop mismatches
- **Vercel Configuration**: Updated `vercel.json` for TypeScript files

## 🔧 Required Environment Variables

Add these environment variables in your Vercel dashboard:

### 1. Supabase Configuration (Required)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Authentication (Required for Auth)
```env
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=https://launch-agent-samakova.vercel.app
```

### 3. OAuth Providers (Optional)
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_app_id
GITHUB_SECRET=your_github_app_secret
```

### 4. AI Services (Required for AI features)
```env
OPENAI_API_KEY=your_openai_api_key
TAVILY_API_KEY=your_tavily_api_key
FIRECRAWL_API_KEY=your_firecrawl_api_key
```

### 5. Redis (Required for Chat)
```env
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

### 6. App Configuration
```env
NEXT_PUBLIC_BASE_URL=https://launch-agent-samakova.vercel.app
```

## 🚀 Deployment Steps

### Step 1: Set Up Environment Variables

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add all the required variables above
5. Make sure to set them for Production, Preview, and Development

### Step 2: Set Up Supabase Database

1. Create a new Supabase project at https://supabase.com
2. Run the SQL from `lib/database.sql` in your Supabase SQL editor
3. Copy your project URL and anon key to the environment variables

### Step 3: Configure Authentication

1. In Supabase, go to Authentication → Settings
2. Add your Vercel domain to Site URL and Redirect URLs:
   - Site URL: `https://launch-agent-samakova.vercel.app`
   - Redirect URLs: `https://launch-agent-samakova.vercel.app/api/auth/callback/google`

### Step 4: Deploy

1. Push your code to GitHub (already done!)
2. Connect your GitHub repo to Vercel
3. Vercel will automatically deploy when you push changes

## 🔍 Troubleshooting

### Build Fails with "supabaseUrl is required"
- Make sure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Environment variables must be prefixed with `NEXT_PUBLIC_` for client-side access

### TypeScript Errors
- All TypeScript errors have been fixed in the latest commit
- Make sure you're using the latest code from the repository

### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set (generate one with `openssl rand -base64 32`)
- Check that `NEXTAUTH_URL` matches your Vercel domain
- Ensure redirect URLs are configured in Supabase

### AI Features Not Working
- Verify all API keys are set correctly
- Check API key permissions and quotas
- Ensure the APIs are accessible from Vercel's servers

## 📋 Quick Setup Checklist

- [ ] Set up Supabase project and database
- [ ] Add all environment variables to Vercel
- [ ] Configure authentication redirect URLs
- [ ] Test deployment
- [ ] Verify all features work in production

## 🎯 Minimum Required Variables

For a basic deployment, you need at minimum:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=https://launch-agent-samakova.vercel.app
OPENAI_API_KEY=your_openai_key
```

## 🔗 Getting API Keys

- **Supabase**: https://supabase.com (free tier available)
- **OpenAI**: https://platform.openai.com/api-keys
- **Tavily**: https://tavily.com (for market research)
- **Firecrawl**: https://firecrawl.dev (for competitive intelligence)
- **Upstash Redis**: https://upstash.com (for chat functionality)

Your deployment should now work successfully! 🚀 