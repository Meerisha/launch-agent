# LaunchPilot - Project Structure

## Overview
LaunchPilot is an AI-powered launch consultant that transforms ideas into revenue-generating products. The project is organized into clear, modular directories for maintainability and scalability.

## Project Structure

```
launch-planner-mcp/
├── app/                     # Next.js Application (Frontend & API Routes)
│   ├── api/                 # Backend API Routes
│   │   ├── analyze/         # Project analysis endpoint
│   │   ├── chat/            # AI chat endpoint
│   │   ├── competitive-intelligence/ # Competitor analysis
│   │   ├── export/pdf/      # PDF export functionality
│   │   └── market-research/ # Market research endpoint
│   ├── components/          # React Components
│   │   ├── ChatInterface.tsx
│   │   ├── MetricsDashboard.tsx
│   │   └── ShareButtons.tsx
│   ├── dashboard/           # Dashboard pages
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── tools/                   # MCP Tools (AI Agents)
│   ├── index.ts             # Tool exports
│   ├── competitive-intelligence.ts
│   ├── launch-strategy.ts
│   ├── project-intake.ts
│   └── revenue-calculator.ts
├── integrations/            # External API Integrations
│   ├── openai.ts            # OpenAI GPT integration
│   ├── tavily.ts            # Tavily search integration
│   └── firecrawl.ts         # Firecrawl scraping integration
├── lib/                     # Shared Utilities
│   ├── redis.ts             # Redis caching utilities
│   └── utils.ts             # Helper functions
├── docs/                    # Documentation
│   ├── PROJECT_STRUCTURE.md # This file
│   ├── README.md            # Main documentation
│   ├── README_CHAT.md       # Chat feature documentation
│   ├── setup.sh             # Setup script
│   └── deploy.sh            # Deployment script
└── Configuration Files
    ├── package.json         # Dependencies and scripts
    ├── tsconfig.json        # TypeScript configuration
    ├── tailwind.config.js   # Tailwind CSS configuration
    ├── next.config.ts       # Next.js configuration
    └── vercel.json          # Vercel deployment configuration
```

## Directory Descriptions

### `/app` - Next.js Application
The main application directory following Next.js 15 App Router conventions.

**Frontend Components (`/app/components`)**:
- `ChatInterface.tsx` - Interactive AI chat interface
- `MetricsDashboard.tsx` - Real-time metrics visualization and scenario modeling
- `ShareButtons.tsx` - Social sharing functionality

**API Routes (`/app/api`)**:
- `analyze/` - Main project analysis endpoint
- `chat/` - AI chat conversation endpoint
- `competitive-intelligence/` - Competitor analysis and market intelligence
- `export/pdf/` - PDF export for reports
- `market-research/` - Market research data endpoint

### `/tools` - MCP Tools (AI Agents)
Model Context Protocol (MCP) tools that provide AI agent capabilities.

- `project-intake.ts` - Project information collection and validation
- `revenue-calculator.ts` - Financial projections and revenue modeling
- `launch-strategy.ts` - Go-to-market strategy generation
- `competitive-intelligence.ts` - Comprehensive competitor analysis
- `index.ts` - Tool exports and configuration

### `/integrations` - External API Integrations
Centralized external service integrations for modularity and reusability.

- `openai.ts` - OpenAI GPT-4 integration for AI analysis and chat
- `tavily.ts` - Tavily search API for market research and competitive intelligence
- `firecrawl.ts` - Firecrawl API for web scraping and data extraction

### `/lib` - Shared Utilities
Common utilities and helper functions used across the application.

- `redis.ts` - Redis caching utilities with TTL support
- `utils.ts` - General helper functions and utilities

### `/docs` - Documentation
Project documentation, setup guides, and deployment scripts.

- `PROJECT_STRUCTURE.md` - This documentation file
- `README.md` - Main project documentation
- `README_CHAT.md` - Chat feature-specific documentation
- `setup.sh` - Environment setup script
- `deploy.sh` - Deployment automation script

## Key Features by Directory

### Frontend Features (`/app`)
- **Interactive Chat Interface**: AI-powered conversation with context awareness
- **Real-time Metrics Dashboard**: Live business metrics with scenario modeling
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Social Sharing**: Built-in sharing capabilities for reports

### Backend Features (`/app/api`)
- **RESTful API**: Clean API design with proper HTTP status codes
- **Caching**: Redis-powered caching for performance optimization
- **Input Validation**: Zod schema validation for all inputs
- **Error Handling**: Comprehensive error handling with graceful fallbacks

### AI Agent Features (`/tools`)
- **Project Analysis**: Automated project viability assessment
- **Financial Modeling**: Revenue projections with break-even analysis
- **Market Intelligence**: Real-time competitor and market data
- **Strategic Planning**: Go-to-market strategy generation

### Integration Features (`/integrations`)
- **AI-Powered Analysis**: OpenAI GPT-4 for intelligent insights
- **Market Research**: Tavily search for real-time market data
- **Web Scraping**: Firecrawl for competitor data extraction
- **Data Aggregation**: Unified data from multiple sources

## Technology Stack

### Frontend
- **Next.js 15.2.4** - React framework with App Router
- **React 19.1.0** - UI library with modern hooks
- **TypeScript 5.x** - Type-safe development
- **Tailwind CSS 4.x** - Utility-first CSS framework
- **Recharts** - Interactive data visualization

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Upstash Redis** - Caching and session storage
- **Zod** - Runtime type validation
- **OpenAI API** - AI-powered analysis

### External Services
- **Tavily API** - Real-time search and market data
- **Firecrawl API** - Web scraping and data extraction
- **Google Trends** - Market trend analysis
- **Vercel** - Deployment platform

## Development Workflow

### Setup
1. Run `docs/setup.sh` for environment configuration
2. Install dependencies: `npm install`
3. Configure environment variables in `.env.local`
4. Start development server: `npm run dev`

### Development
- Frontend development in `/app/components` and `/app`
- API development in `/app/api`
- Agent development in `/tools`
- Integration development in `/integrations`

### Testing
- API testing scripts available in original `/scripts` (moved to docs)
- Unit tests for individual components and utilities
- Integration tests for API endpoints

### Deployment
1. Run `docs/deploy.sh` for automated deployment
2. Vercel deployment with automatic builds
3. Environment variable configuration in deployment platform

## Architecture Principles

### Separation of Concerns
- **Frontend**: User interface and client-side logic
- **Backend**: API routes and server-side processing
- **Agents**: AI tools and business logic
- **Integrations**: External service abstractions

### Modularity
- Clear boundaries between different functional areas
- Reusable components and utilities
- Pluggable integration architecture

### Scalability
- Caching strategies for performance
- Serverless architecture for automatic scaling
- Modular design for easy feature additions

### Maintainability
- Comprehensive TypeScript typing
- Clear directory structure
- Extensive documentation
- Consistent code patterns

## Next Steps

### Immediate Improvements
1. Update import paths after reorganization
2. Fix TypeScript errors in integration modules
3. Update configuration files for new structure
4. Test all functionality after reorganization

### Future Enhancements
1. Add comprehensive test suite
2. Implement CI/CD pipeline
3. Add monitoring and analytics
4. Expand integration ecosystem

## Contributing

When contributing to LaunchPilot:

1. Follow the established directory structure
2. Maintain separation between frontend, backend, agents, and integrations
3. Add comprehensive TypeScript types
4. Include documentation for new features
5. Follow the existing code patterns and conventions

For more detailed information, see the individual README files in each directory. 