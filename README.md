# LaunchPilot AI Consultant 🚀

LaunchPilot is an advanced AI-powered business launch consultant that helps entrepreneurs analyze project ideas, create revenue projections, develop launch strategies, and generate comprehensive market intelligence. Enhanced with **Retrieval-Augmented Generation (RAG)** for expert knowledge and insights.

## 🌐 Live Demo

**Try it now:** [https://launch-pilot-ai.vercel.app/](https://launch-pilot-ai.vercel.app/)

Experience the full power of LaunchPilot's AI-driven business consulting platform with real-time analysis, RAG-enhanced insights, and comprehensive project evaluation tools.

## 🧠 Enhanced AI with RAG

LaunchPilot now features a comprehensive knowledge base powered by RAG technology:

- **Expert Business Knowledge**: Industry insights, launch strategies, market research methodologies
- **Contextual Responses**: AI responses enhanced with relevant business frameworks and best practices  
- **Proven Strategies**: Access to case studies, financial models, and growth tactics
- **Smart Retrieval**: Automatically finds and applies relevant knowledge based on your project context

## ✨ Features

### Core Capabilities
- **AI Chat Interface**: Interactive consultant powered by GPT-4 with RAG enhancement
- **Project Analysis**: Comprehensive project evaluation and recommendations
- **Revenue Calculator**: Advanced financial projections and scenario modeling
- **Launch Strategy**: Tactical launch plans with timeline and budget allocation
- **Competitive Intelligence**: Market research and competitor analysis
- **Instagram Generator**: AI-generated Instagram content and strategy
- **Metrics Dashboard**: Real-time business metrics and performance tracking

### RAG Knowledge Base
- **Launch Strategies**: SaaS, e-commerce, consulting, and more
- **Industry Insights**: Current market trends and opportunities
- **Financial Frameworks**: Unit economics, cash flow planning, pricing strategies
- **Best Practices**: Proven methodologies from successful launches
- **Case Studies**: Real-world examples and lessons learned

### Advanced Tools
- **MCP Integration**: Model Context Protocol for external data and analysis
- **Real-time Research**: Web scraping and market intelligence
- **Document Export**: Professional PDF and PowerPoint report generation
- **Sample Projects**: Pre-built analysis examples for learning
- **Analytics Dashboard**: Performance metrics and business insights
- **Project Management**: Save, track, and manage multiple projects

## 🚀 Quick Start

### Prerequisites
- Node.js
- Supabase account with pgvector extension
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd launch-planner-mcp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys to .env.local

# Set up RAG system (database + knowledge base)
npm run setup-rag

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Supabase Configuration  
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# External APIs (Optional)
FIRECRAWL_API_KEY=your_firecrawl_key
TAVILY_API_KEY=your_tavily_key

# Redis (Optional - for caching)
REDIS_URL=your_redis_url
```

## 🧠 RAG System

### Knowledge Base Structure

The RAG system organizes knowledge into categories:

- **Launch Strategies**: Step-by-step frameworks for different business types
- **Industry Insights**: Market trends, opportunities, and challenges  
- **Best Practices**: Proven methodologies and tactics
- **Case Studies**: Success stories and lessons learned
- **Frameworks**: Business models, financial planning, and analysis tools

### How RAG Enhances Responses

1. **Query Analysis**: User questions are analyzed for context and intent
2. **Knowledge Retrieval**: Relevant documents are found using semantic search
3. **Context Integration**: Retrieved knowledge is integrated into AI responses
4. **Source Attribution**: Users can see which knowledge sources informed the response

### Managing Knowledge

```bash
# Seed initial knowledge base
npm run setup-rag

# Add domain-specific knowledge via API
GET /api/rag?action=add-domain&domain=fintech

# Search knowledge base
GET /api/rag?action=search&query=saas pricing strategy

# Store new documents
POST /api/rag
{
  "action": "store",
  "document": {
    "title": "Document Title",
    "content": "Document content...",
    "document_type": "best_practice",
    "category": "saas",
    "tags": ["pricing", "strategy"]
  }
}
```

## 📊 API Endpoints

### Core APIs
- `POST /api/chat` - Enhanced AI chat with RAG
- `POST /api/analyze` - Project analysis
- `GET /api/rag` - Knowledge base operations
- `POST /api/competitive-intelligence` - Market research
- `POST /api/financial` - Revenue calculations
- `POST /api/projects` - Project management
- `POST /api/export` - Report generation

### RAG Endpoints
- `GET /api/rag?action=search` - Search knowledge base
- `GET /api/rag?action=context` - Get full RAG context
- `POST /api/rag` - Store knowledge documents
- `GET /api/rag?action=seed` - Initialize knowledge base

## 🛠 Development

### Organized Project Structure

```
launch-planner-mcp/
├── app/                           # Next.js app directory
│   ├── components/                # React components (organized by functionality)
│   │   ├── auth/                 # Authentication components
│   │   │   ├── AuthButton.tsx
│   │   │   └── index.ts
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── ShareButtons.tsx
│   │   │   └── index.ts
│   │   ├── features/             # Main feature components
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── EnhancedFinancialCalculator.tsx
│   │   │   ├── InstagramImageGenerator.tsx
│   │   │   ├── MetricsDashboard.tsx
│   │   │   ├── ReportGenerator.tsx
│   │   │   └── index.ts
│   │   ├── project/              # Project management components
│   │   │   ├── ProjectHistory.tsx
│   │   │   ├── SampleProjectSelector.tsx
│   │   │   ├── SaveProjectButton.tsx
│   │   │   └── index.ts
│   │   └── index.ts              # Main component exports
│   ├── api/                      # API routes
│   │   ├── chat/                # Enhanced chat with RAG
│   │   ├── rag/                 # RAG operations
│   │   ├── auth/                # Authentication endpoints
│   │   ├── projects/            # Project management
│   │   └── ...
│   ├── auth/                    # Authentication pages
│   ├── dashboard/               # Dashboard page
│   └── ...
├── lib/                         # Core libraries
│   ├── auth.ts                  # Authentication configuration
│   ├── rag.ts                   # RAG system implementation
│   ├── knowledge-seeder.ts      # Knowledge base seeding
│   ├── supabase.ts             # Database client
│   ├── database.sql            # Database schema
│   ├── report-generator.ts     # Report generation logic
│   └── ...
├── tools/                       # MCP tools (organized by category)
│   ├── analysis/               # Competitive & market analysis
│   │   ├── competitive-intelligence.ts
│   │   └── index.ts
│   ├── financial/              # Financial calculations & projections
│   │   ├── revenue-calculator.ts
│   │   └── index.ts
│   ├── marketing/              # Marketing & social media tools
│   │   ├── social-media-strategy.ts
│   │   ├── instagram-image-generator.ts
│   │   └── index.ts
│   ├── strategy/               # Business strategy & planning
│   │   ├── project-intake.ts
│   │   ├── launch-strategy.ts
│   │   └── index.ts
│   └── index.ts                # Main tool exports
├── docs/                       # Documentation (organized by topic)
│   ├── setup/                  # Setup & deployment guides
│   │   ├── AUTH_SETUP.md
│   │   ├── RAG_SETUP.md
│   │   ├── VERCEL_DEPLOYMENT.md
│   │   └── ...
│   ├── features/               # Feature documentation
│   │   ├── README_CHAT.md
│   │   ├── README_REPORTS.md
│   │   └── README_SAMPLES.md
│   ├── development/            # Development guides
│   │   ├── AUTHENTICATION_IMPLEMENTATION.md
│   │   ├── MISSING_FEATURES.md
│   │   └── ...
│   └── README.md               # Main documentation
├── scripts/                    # Setup and utility scripts
├── types/                      # TypeScript type definitions
└── [config files]             # Package.json, tsconfig, etc.
```

### Import Patterns

The organized structure supports multiple clean import patterns:

#### Components
```typescript
// Option 1: Direct import
import ChatInterface from '@/app/components/features/ChatInterface'

// Option 2: Category import
import { ChatInterface } from '@/app/components/features'

// Option 3: Main index import
import { ChatInterface } from '@/app/components'
```

#### Tools
```typescript
// Option 1: Direct import
import { revenueCalculatorTool } from '@/tools/financial/revenue-calculator'

// Option 2: Category import  
import { revenueCalculatorTool } from '@/tools/financial'

// Option 3: Main index import
import { revenueCalculatorTool } from '@/tools'
```

### Development Benefits

- **Better Maintainability**: Related files are grouped together
- **Easy Navigation**: Logical file organization makes finding code simple
- **Clear Separation**: Components, tools, and docs are properly categorized
- **Scalable Architecture**: Easy to add new features to appropriate categories
- **Self-Documenting**: Structure clearly shows what each part does

### Adding New Features

#### New Component
```bash
# Add to appropriate category
app/components/features/NewFeature.tsx
# Export in category index
app/components/features/index.ts
```

#### New Tool
```bash
# Add to appropriate category
tools/analysis/new-analysis-tool.ts
# Export in category index
tools/analysis/index.ts
```

#### New Documentation
```bash
# Add to appropriate topic
docs/features/NEW_FEATURE.md
```

### Adding New Knowledge

1. **Create Knowledge Documents**:
```typescript
import { storeKnowledgeDocument } from './lib/rag';

const document = {
  title: "New Business Framework",
  content: "Detailed framework content...",
  document_type: "framework",
  category: "general", 
  tags: ["framework", "strategy"]
};

await storeKnowledgeDocument(document);
```

2. **Test RAG Integration**:
```bash
# Search for your new content
curl "http://localhost:3000/api/rag?action=search&query=business framework"
```

## 📈 Analytics & Monitoring

The system tracks:
- RAG query patterns and popular searches
- Knowledge retrieval effectiveness
- User interaction analytics
- Project creation and completion rates
- System performance metrics

## 🔧 Configuration

### RAG Settings

- **Embedding Model**: OpenAI text-embedding-ada-002
- **Vector Database**: Supabase with pgvector
- **Similarity Threshold**: 0.75 (configurable)
- **Max Results**: 8 documents per query
- **Chunk Size**: 1000 characters

### Performance Optimization

- Redis caching for frequently accessed content
- Vector index optimization for fast similarity search
- Intelligent chunk sizing for better embeddings
- Query preprocessing for better retrieval

## 📚 Documentation

- **Setup Guides**: [docs/setup/](docs/setup/) - Authentication, RAG, Deployment
- **Feature Docs**: [docs/features/](docs/features/) - Chat, Reports, Samples
- **Development**: [docs/development/](docs/development/) - Project structure, Implementation guides
- **Project Structure**: [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Detailed organization guide

## 🧪 Testing

```bash
# Run tests
npm test

# Test build
npm run build

# Check types
npm run type-check

# Lint code
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Add all required env vars in Vercel dashboard
3. **Deploy**: Push to main branch for automatic deployment

### Creating Shorter URLs

Create custom aliases for cleaner deployment URLs:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
npx vercel login

# Create shorter alias
npx vercel alias <your-long-deployment-url> <your-short-name>.vercel.app
```

**Live Demo:** [https://launch-pilot-ai.vercel.app/](https://launch-pilot-ai.vercel.app/)

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the organized structure for new components/tools
4. Add knowledge documents for new domains
5. Test RAG integration thoroughly  
6. Commit changes (`git commit -m 'Add amazing feature'`)
7. Push to branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Organization Guidelines

- Place components in appropriate categories (`auth/`, `ui/`, `features/`, `project/`)
- Add tools to relevant business categories (`analysis/`, `financial/`, `marketing/`, `strategy/`)
- Update index files for clean imports
- Document new features in appropriate docs categories

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@launchpilot.ai
- 📖 Documentation: [docs/](docs/)
- 🐛 Issues: [GitHub Issues](issues/)
- 📋 Project Structure: [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

---

Built with ❤️ by the LaunchPilot team. Powered by OpenAI, Supabase, and Next.js with organized, maintainable architecture. 