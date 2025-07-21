# LaunchPilot AI Consultant 🚀

LaunchPilot is an advanced AI-powered business launch consultant that helps entrepreneurs analyze project ideas, create revenue projections, develop launch strategies, and generate comprehensive market intelligence. Enhanced with **Retrieval-Augmented Generation (RAG)** for expert knowledge and insights.

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
- **Revenue Calculator**: Financial projections and scenario modeling
- **Launch Strategy**: Tactical launch plans with timeline and budget allocation
- **Competitive Intelligence**: Market research and competitor analysis
- **Social Media Generator**: AI-generated Instagram content and strategy

### RAG Knowledge Base
- **Launch Strategies**: SaaS, e-commerce, consulting, and more
- **Industry Insights**: Current market trends and opportunities
- **Financial Frameworks**: Unit economics, cash flow planning, pricing strategies
- **Best Practices**: Proven methodologies from successful launches
- **Case Studies**: Real-world examples and lessons learned

### Advanced Tools
- **MCP Integration**: Model Context Protocol for external data
- **Real-time Research**: Web scraping and market intelligence
- **Document Export**: PDF and PowerPoint report generation
- **Sample Projects**: Pre-built analysis examples
- **Analytics Dashboard**: Performance metrics and insights

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
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

# External APIs (Optional)
FIRECRAWL_API_KEY=your_firecrawl_key
TAVILY_API_KEY=your_tavily_key

# Redis (Optional - for caching)
REDIS_URL=your_redis_url

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
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

### RAG Endpoints
- `GET /api/rag?action=search` - Search knowledge base
- `GET /api/rag?action=context` - Get full RAG context
- `POST /api/rag` - Store knowledge documents
- `GET /api/rag?action=seed` - Initialize knowledge base

## 🛠 Development

### Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── chat/          # Enhanced chat with RAG
│   │   ├── rag/           # RAG operations
│   │   └── ...
│   ├── components/        # React components
│   └── ...
├── lib/                   # Core libraries
│   ├── rag.ts            # RAG system implementation
│   ├── knowledge-seeder.ts # Knowledge base seeding
│   ├── supabase.ts       # Database client
│   └── ...
├── tools/                 # Analysis tools
├── scripts/              # Setup and utility scripts
└── docs/                 # Documentation
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

- [RAG Implementation Guide](docs/RAG_IMPLEMENTATION.md)
- [Knowledge Management](docs/KNOWLEDGE_MANAGEMENT.md)
- [API Documentation](docs/API_REFERENCE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Add knowledge documents for new domains
4. Test RAG integration thoroughly  
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@launchpilot.ai
- 📖 Documentation: [docs/](docs/)
- 🐛 Issues: [GitHub Issues](issues/)

---

Built with ❤️ by the LaunchPilot team. Powered by OpenAI, Supabase, and Next.js. 