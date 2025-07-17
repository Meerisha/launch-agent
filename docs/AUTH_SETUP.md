# LaunchPilot Authentication & Persistence Setup

This guide will help you set up user authentication and project persistence for LaunchPilot.

## 🏗️ Architecture Overview

The authentication and persistence system includes:

- **NextAuth.js** - Authentication with email/password and OAuth providers
- **Supabase** - PostgreSQL database with Row Level Security (RLS)
- **Project Persistence** - Save/load user projects and analysis results
- **User Dashboard** - Manage project history and account settings

## 📋 Prerequisites

1. **Supabase Account** - Sign up at [supabase.com](https://supabase.com)
2. **OAuth Providers** (Optional) - Google and/or GitHub OAuth apps
3. **Existing LaunchPilot Setup** - Base app should be running

## 🔧 Setup Steps

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned (2-3 minutes)
3. Go to **Settings > API** and copy:
   - Project URL
   - Anon public key
   - Service role key (keep this secret!)

### 2. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `lib/database.sql`
3. Run the SQL script to create tables, policies, and triggers

### 3. Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3003
NEXTAUTH_SECRET=your-nextauth-secret-here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Existing API Keys (keep your existing values)
OPENAI_API_KEY=your-openai-api-key
TAVILY_API_KEY=your-tavily-api-key
FIRECRAWL_API_KEY=your-firecrawl-api-key
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

### 4. Generate NextAuth Secret

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Add this to your `NEXTAUTH_SECRET` environment variable.

### 5. Set Up OAuth Providers (Optional)

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to **Credentials > Create Credentials > OAuth 2.0 Client ID**
5. Set authorized redirect URI: `http://localhost:3003/api/auth/callback/google`
6. Copy Client ID and Client Secret to your `.env.local`

#### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3003/api/auth/callback/github`
4. Copy Client ID and Client Secret to your `.env.local`

### 6. Configure Supabase Authentication

1. In Supabase dashboard, go to **Authentication > Settings**
2. Under **Site URL**, add: `http://localhost:3003`
3. Under **Redirect URLs**, add: `http://localhost:3003/api/auth/callback/supabase`

### 7. Install Dependencies

The required packages should already be installed. If not:

```bash
npm install next-auth @supabase/supabase-js @supabase/ssr
```

### 8. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3003`
3. Click "Get Started" to test registration
4. Try signing in with email/password and OAuth providers
5. Create a project and verify it saves to your dashboard

## 🔒 Security Features

### Row Level Security (RLS)

- Users can only access their own projects
- All database operations are automatically filtered by user ID
- Prevents data leaks between users

### Authentication Flow

1. **Registration**: Creates user in Supabase Auth + custom profile
2. **Sign In**: Validates credentials and creates session
3. **Session Management**: JWT tokens with automatic refresh
4. **Sign Out**: Clears session and redirects

### API Protection

- All project APIs require authentication
- Middleware protects dashboard routes
- User ownership validation on all operations

## 📊 Database Schema

### Users Table
```sql
- id (UUID, primary key, references auth.users)
- email (TEXT, unique)
- name (TEXT, nullable)
- avatar_url (TEXT, nullable)
- created_at, updated_at (TIMESTAMP)
```

### Projects Table
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- name (TEXT)
- description (TEXT, nullable)
- data (JSONB) - form data
- analysis (JSONB, nullable) - AI analysis results
- status (ENUM: draft, in_progress, completed, archived)
- created_at, updated_at (TIMESTAMP)
```

### Chat Conversations Table
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- project_id (UUID, foreign key, nullable)
- title (TEXT)
- messages (JSONB) - array of messages
- context (JSONB, nullable)
- created_at, updated_at (TIMESTAMP)
```

### Financial Models Table
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- project_id (UUID, foreign key)
- name (TEXT)
- data (JSONB) - financial inputs
- calculations (JSONB, nullable) - results
- created_at, updated_at (TIMESTAMP)
```

## 🚀 New Features Available

### User Dashboard
- View all saved projects
- Filter by status (draft, in_progress, completed, archived)
- Search projects by name/description
- Quick actions (view, edit status, delete)

### Project Persistence
- Auto-save project data and analysis results
- Load projects from dashboard
- Project status tracking
- Export capabilities

### Authentication Options
- Email/password registration and login
- Google OAuth (optional)
- GitHub OAuth (optional)
- Secure session management

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth endpoints

### Projects
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get specific project
- `PATCH /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

## 🐛 Troubleshooting

### Common Issues

1. **"Unauthorized" errors**
   - Check that NEXTAUTH_SECRET is set
   - Verify user is signed in
   - Check middleware configuration

2. **Database connection issues**
   - Verify Supabase URL and keys are correct
   - Check that database schema was created
   - Ensure RLS policies are active

3. **OAuth not working**
   - Check redirect URLs match exactly
   - Verify OAuth app credentials
   - Check provider is enabled in NextAuth config

### Debugging Tips

1. Check browser console for errors
2. Check server logs in terminal
3. Verify environment variables are loaded
4. Test API endpoints directly with curl/Postman

## 🎯 Next Steps

With authentication and persistence set up, you can now:

1. **Save Projects**: All form data and analysis results persist
2. **User Management**: Users have secure accounts and dashboards
3. **Project History**: Track project evolution over time
4. **Collaboration**: Foundation for sharing and team features

The system is now ready for production deployment with proper user management and data persistence!

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security) 