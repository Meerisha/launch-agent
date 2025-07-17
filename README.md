# 🚀 LaunchPilot - AI Launch Consultant

> Transform your raw idea into a revenue-generating product with AI-powered launch consulting

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green.svg)](https://supabase.com/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-Authentication-purple.svg)](https://next-auth.js.org/)

LaunchPilot is a comprehensive AI-powered launch consultant that helps entrepreneurs, creators, and businesses transform ideas into successful product launches. With advanced financial modeling, competitive intelligence, and strategic planning, LaunchPilot guides you through every step of the launch process.

## 🌟 Features

### 🔐 **User Management & Persistence**
- **Secure Authentication** - Email/password and OAuth (Google, GitHub)
- **Project Persistence** - Save and load projects across sessions
- **User Dashboard** - Manage project history with search and filtering
- **Data Security** - Row Level Security with user isolation

### 🤖 **AI-Powered Analysis**
- **Project Analysis** - Comprehensive viability assessment
- **Market Research** - Real-time competitive intelligence via Tavily API
- **Revenue Forecasting** - Advanced financial projections and break-even analysis
- **Launch Strategy** - Custom go-to-market roadmap generation

### 📊 **Advanced Financial Modeling**
- **Interactive Calculator** - Multi-scenario financial projections
- **Product Intelligence** - SaaS, Course, Consulting, Physical, Digital product types
- **Advanced Metrics** - LTV:CAC ratio, churn modeling, ROI calculations
- **Visual Charts** - Recharts integration for data visualization
- **Export Capabilities** - Save financial models to projects

### 💬 **Dual Interface**
- **Form Mode** - Structured project intake with guided fields
- **Chat Mode** - Conversational AI analysis with context awareness
- **Sample Projects** - 6 realistic business scenarios to explore

### 📈 **Real-Time Intelligence**
- **Competitive Analysis** - Automated competitor research
- **Market Trends** - Live market data and opportunity assessment
- **Industry Benchmarking** - Compare against market standards

### 📄 **Professional Reports**
- **PDF Export** - Comprehensive launch strategy documents
- **PowerPoint Export** - Presentation-ready analysis reports
- **Custom Branding** - Personalized report styling
- **Multiple Report Types** - Competitive intelligence, financial, comprehensive

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15.2.4** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Interactive data visualization
- **Lucide React** - Modern icon library

### **Backend**
- **Next.js API Routes** - Serverless backend
- **NextAuth.js** - Authentication and session management
- **Supabase** - PostgreSQL database with Row Level Security
- **Upstash Redis** - Caching and session storage
- **Zod** - Runtime type validation

### **AI & External APIs**
- **OpenAI GPT-4** - AI analysis and chat functionality
- **Tavily API** - Real-time search and market research
- **Firecrawl API** - Web scraping and data extraction

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and npm
- **Supabase account** for database
- **API keys** for OpenAI, Tavily (see setup guide)

### 1. Clone & Install
```bash
git clone https://github.com/meerisha/launch-agent.git
cd launch-planner-mcp
npm install
```

### 2. Environment Setup
Create `.env.local` file:
```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Database
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# AI APIs
OPENAI_API_KEY=your-openai-key
TAVILY_API_KEY=your-tavily-key
FIRECRAWL_API_KEY=your-firecrawl-key

# Redis Cache
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

### 3. Database Setup
1. Create Supabase project
2. Run SQL schema from `lib/database.sql`
3. Enable Row Level Security policies

### 4. Start Development
```bash
npm run dev
```

Visit `http://localhost:3000` to get started!

## 📁 Project Structure

```
launch-planner-mcp/
├── app/                     # Next.js App Router
│   ├── api/                 # Backend API Routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── projects/       # Project CRUD operations
│   │   ├── chat/           # AI chat interface
│   │   ├── financial/      # Financial modeling
│   │   ├── analyze/        # Project analysis
│   │   └── export/         # Report generation
│   ├── auth/               # Authentication pages
│   │   ├── signin/         # Sign-in page
│   │   └── signup/         # Registration page
│   ├── components/         # React components
│   │   ├── AuthButton.tsx           # Authentication UI
│   │   ├── ChatInterface.tsx        # AI chat interface
│   │   ├── EnhancedFinancialCalculator.tsx  # Financial modeling
│   │   ├── MetricsDashboard.tsx     # Analytics dashboard
│   │   ├── ProjectHistory.tsx       # Project management
│   │   ├── ReportGenerator.tsx      # PDF/PowerPoint export
│   │   ├── SampleProjectSelector.tsx # Example projects
│   │   └── SaveProjectButton.tsx    # Project persistence
│   ├── dashboard/          # User dashboard
│   └── globals.css         # Global styles
├── lib/                    # Shared utilities
│   ├── auth.ts            # NextAuth configuration
│   ├── supabase.ts        # Database client
│   ├── redis.ts           # Cache utilities
│   ├── database.sql       # Database schema
│   └── utils.ts           # Helper functions
├── tools/                  # MCP AI Tools
│   ├── project-intake.ts   # Project analysis
│   ├── revenue-calculator.ts # Financial projections
│   ├── launch-strategy.ts  # Go-to-market planning
│   └── competitive-intelligence.ts # Market research
├── docs/                   # Documentation
│   ├── AUTH_SETUP.md       # Authentication setup guide
│   ├── AUTHENTICATION_IMPLEMENTATION.md # Implementation details
│   ├── MISSING_FEATURES.md # Feature roadmap
│   └── PROJECT_STRUCTURE.md # Architecture overview
└── types/                  # TypeScript definitions
    └── next-auth.d.ts     # NextAuth type extensions
```

## 🎯 Usage Guide

### **For Entrepreneurs**
1. **Sign up** for a free account
2. **Describe your idea** using form or chat interface
3. **Get AI analysis** with market research and financial projections
4. **Download reports** in PDF or PowerPoint format
5. **Track progress** in your personal dashboard

### **For Consultants**
1. **Use sample projects** to demonstrate capabilities
2. **Generate professional reports** for clients
3. **Customize branding** for white-label usage
4. **Export financial models** for detailed analysis

### **For Developers**
1. **Fork the repository** and customize for your needs
2. **Extend AI tools** in the `/tools` directory
3. **Add integrations** via the API architecture
4. **Deploy to production** with included configurations

## 🔧 API Reference

### **Authentication**
```
POST /api/auth/register     # User registration
GET  /api/auth/signin       # Sign-in page
POST /api/auth/signout      # Logout
```

### **Projects**
```
GET    /api/projects        # List user projects
POST   /api/projects        # Create project
GET    /api/projects/[id]   # Get project
PATCH  /api/projects/[id]   # Update project
DELETE /api/projects/[id]   # Delete project
```

### **Analysis**
```
POST /api/analyze           # Project analysis
POST /api/chat              # AI chat interaction
POST /api/financial         # Financial modeling
POST /api/market-research   # Market intelligence
```

### **Export**
```
POST /api/export            # Generate PDF/PowerPoint reports
```

## 🌟 Sample Projects

LaunchPilot includes 6 realistic sample projects to explore:

1. **AI-Powered CRM SaaS** - B2B software platform
2. **Online Course Platform** - Educational content business
3. **Freelance Consulting** - Service-based business
4. **E-commerce Store** - Physical product retail
5. **Mobile App** - Consumer mobile application
6. **Local Service** - Location-based service business

## 🔒 Security Features

- **Row Level Security (RLS)** - Database-level user isolation
- **JWT Authentication** - Secure session management
- **Input Validation** - Zod schema validation on all endpoints
- **Protected Routes** - Middleware-based access control
- **OAuth Integration** - Google and GitHub authentication
- **HTTPS Only** - Secure cookie handling in production

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### **Docker**
```bash
docker build -t launchpilot .
docker run -p 3000:3000 launchpilot
```

### **Manual Deployment**
```bash
npm run build
npm start
```

## 📊 Performance

- **Caching Strategy** - Redis-powered API response caching
- **Database Optimization** - Indexed queries and RLS policies
- **Serverless Architecture** - Auto-scaling API routes
- **Static Generation** - Optimized page loading
- **Image Optimization** - Next.js automatic image optimization

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Process**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Areas for Contribution**
- 🤖 **AI Tools** - Enhance analysis algorithms
- 🎨 **UI/UX** - Improve user interface and experience
- 📊 **Analytics** - Add new metrics and visualizations
- 🔗 **Integrations** - Connect with external platforms
- 📚 **Documentation** - Improve guides and examples

## 🗺️ Roadmap

### **Completed ✅**
- User authentication and persistence
- AI-powered project analysis
- Advanced financial modeling
- Real-time market research
- Professional report generation
- Sample projects and templates

### **Coming Soon 🚧**
- **Launch Execution Dashboard** - Task management and milestone tracking
- **Team Collaboration** - Multi-user project sharing
- **Platform Integrations** - CRM, email marketing, analytics
- **Advanced AI Features** - Predictive success scoring
- **Mobile App** - Native iOS and Android applications

## 📈 Analytics & Insights

LaunchPilot provides comprehensive analytics:

- **Project Success Metrics** - Track launch performance
- **Financial Projections** - Revenue and cost modeling
- **Market Intelligence** - Competitive positioning
- **User Behavior** - Dashboard usage analytics
- **AI Performance** - Analysis accuracy metrics

## 🆘 Support

### **Documentation**
- [Setup Guide](docs/AUTH_SETUP.md)
- [Architecture Overview](docs/PROJECT_STRUCTURE.md)
- [Feature Roadmap](docs/MISSING_FEATURES.md)

### **Community**
- **GitHub Issues** - Bug reports and feature requests
- **Discussions** - Community support and ideas
- **Wiki** - Extended documentation and tutorials

### **Professional Support**
For enterprise support, custom implementations, or consulting services, please contact us through the repository.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 API powering AI analysis
- **Supabase** for database and authentication infrastructure
- **Vercel** for deployment platform and Next.js framework
- **Tavily** for real-time search and market research
- **Next.js Team** for the amazing React framework
- **Tailwind CSS** for utility-first styling system

---

## 🎯 Get Started Today

Transform your ideas into successful launches with LaunchPilot's AI-powered insights and comprehensive planning tools.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/meerisha/launch-agent)

**Ready to launch?** [Get Started →](http://localhost:3000)

---

<div align="center">
  <strong>Built with ❤️ for entrepreneurs, creators, and innovators worldwide</strong>
</div> 