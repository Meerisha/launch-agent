# RAG System Setup Guide

This guide will help you set up the Retrieval-Augmented Generation (RAG) system in LaunchPilot for enhanced AI responses with expert business knowledge.

## Overview

The RAG system enhances LaunchPilot's AI capabilities by:
- Storing expert business knowledge in a vector database
- Retrieving relevant information based on user queries
- Providing contextual, informed responses using proven strategies
- Tracking knowledge usage for continuous improvement

## Prerequisites

1. **Supabase Project**: You need a Supabase project with the pgvector extension
2. **OpenAI API Key**: For embeddings and chat completion
3. **Node.js 18+**: For running the setup scripts

## Step 1: Database Setup

### Enable pgvector Extension

In your Supabase project:

1. Go to **SQL Editor** in your Supabase dashboard
2. Run this command to enable the vector extension:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Set Up Database Schema

The RAG system requires several new tables:

- `knowledge_documents` - Stores business knowledge articles
- `document_embeddings` - Vector embeddings for semantic search
- `rag_query_history` - Analytics and usage tracking

These will be created automatically when you run the setup script.

## Step 2: Environment Variables

Add these to your `.env.local` file:

```env
# Required for RAG
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional for enhanced features
FIRECRAWL_API_KEY=your_firecrawl_key  # For web scraping
TAVILY_API_KEY=your_tavily_key        # For market research
REDIS_URL=your_redis_url              # For caching
```

## Step 3: Run RAG Setup

Execute the automated setup script:

```bash
npm run setup-rag
```

This script will:
1. Create database tables and indexes
2. Set up the vector search function
3. Seed the knowledge base with initial content
4. Verify the setup is working

## Step 4: Verify Installation

After setup, test the RAG system:

```bash
# Test search functionality
curl "http://localhost:3000/api/rag?action=search&query=saas launch strategy&limit=3"

# Expected response:
{
  "success": true,
  "results": [...],
  "count": 3
}
```

## Knowledge Base Structure

The initial knowledge base includes:

### Launch Strategies
- SaaS product launch frameworks
- E-commerce store launch playbooks
- Consulting business setup guides

### Industry Insights
- Market trends and opportunities
- Consumer behavior analysis
- Technology adoption patterns

### Best Practices
- Pricing strategies and models
- Content marketing approaches
- Financial planning frameworks

### Case Studies
- Successful product launches
- Growth strategy examples
- Lessons learned from failures

### Frameworks
- Customer validation methods
- Competitive analysis templates
- Unit economics calculations

## Adding Custom Knowledge

### Via API

```bash
# Store a new document
curl -X POST http://localhost:3000/api/rag \
  -H "Content-Type: application/json" \
  -d '{
    "action": "store",
    "document": {
      "title": "Your Framework Title",
      "content": "Detailed framework content...",
      "document_type": "framework",
      "category": "saas",
      "tags": ["pricing", "strategy"]
    }
  }'
```

### Via Code

```typescript
import { storeKnowledgeDocument } from './lib/rag';

const document = {
  title: "Advanced SaaS Metrics",
  content: "Comprehensive guide to SaaS metrics including MRR, CAC, LTV...",
  document_type: "best_practice",
  category: "saas",
  tags: ["metrics", "analytics", "saas"],
  source: "Internal Research"
};

await storeKnowledgeDocument(document);
```

## RAG Configuration

### Similarity Threshold
Default: 0.75 (75% similarity required)
- Higher = more strict matching
- Lower = more lenient matching

### Max Results
Default: 8 documents per query
- Balances relevance with response time
- Configurable per query

### Chunk Size
Default: 1000 characters
- Optimized for embedding quality
- Prevents token limit issues

## Performance Optimization

### Redis Caching
Enable Redis for better performance:
- Search results cached for 30 minutes
- Embeddings cached to reduce API calls
- Query patterns analyzed for optimization

### Vector Index Tuning
For large knowledge bases (1000+ documents):

```sql
-- Optimize vector index
CREATE INDEX CONCURRENTLY idx_document_embeddings_vector_optimized 
ON document_embeddings 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 200);
```

### Database Maintenance

```sql
-- Analyze query performance
EXPLAIN ANALYZE 
SELECT * FROM search_similar_documents('[0.1,0.2,...]', 0.7, 5);

-- Update table statistics
ANALYZE knowledge_documents;
ANALYZE document_embeddings;
```

## Usage in Chat Interface

When RAG is active, you'll see:

1. **Source Attribution**: "Enhanced with knowledge base insights (3 sources)"
2. **Relevance Scores**: Shows how well sources match the query
3. **Document Types**: Indicates whether sources are frameworks, case studies, etc.

## Monitoring & Analytics

### Query Analytics

```bash
# Get popular queries
curl "http://localhost:3000/api/rag?action=analytics&type=popular"
```

### Performance Metrics

Monitor in your database:
- Query response times
- Embedding generation time
- Cache hit rates
- Most retrieved documents

## Troubleshooting

### Common Issues

**Error: "pgvector extension not found"**
- Solution: Enable pgvector in Supabase SQL Editor

**Error: "Failed to generate embedding"**
- Check OpenAI API key and quota
- Verify internet connectivity

**Error: "No search results found"**
- Knowledge base may be empty
- Try re-running `npm run setup-rag`
- Check similarity threshold settings

### Debug Mode

Enable detailed logging:

```env
DEBUG=rag:*
```

### Health Check

```bash
# Check system health
curl "http://localhost:3000/api/rag?action=health"
```

## Advanced Configuration

### Custom Document Types

Add new document types in `lib/rag.ts`:

```typescript
document_type: 'industry_insight' | 'launch_strategy' | 'market_research' | 
               'case_study' | 'framework' | 'best_practice' | 'your_custom_type'
```

### Custom Categories

Add industry-specific categories:

```typescript
category: 'saas' | 'ecommerce' | 'consulting' | 'fintech' | 
          'healthtech' | 'edtech' | 'your_industry'
```

### Embedding Model Alternatives

To use different embedding models:

```typescript
// In lib/rag.ts
const response = await openai.embeddings.create({
  model: 'text-embedding-3-small', // or text-embedding-3-large
  input: text
});
```

## Security Considerations

1. **Service Role Key**: Keep SUPABASE_SERVICE_ROLE_KEY secure
2. **Row Level Security**: Enable RLS on knowledge tables for multi-tenant setups
3. **Rate Limiting**: Implement rate limiting for public APIs
4. **Content Validation**: Validate knowledge documents before storing

## Backup & Recovery

### Backup Knowledge Base

```sql
-- Export knowledge documents
COPY (
  SELECT * FROM knowledge_documents
) TO '/path/to/knowledge_backup.csv' WITH CSV HEADER;

-- Export embeddings (optional - can be regenerated)
COPY (
  SELECT document_id, chunk_text FROM document_embeddings
) TO '/path/to/embeddings_backup.csv' WITH CSV HEADER;
```

### Restore from Backup

```sql
-- Import knowledge documents
COPY knowledge_documents FROM '/path/to/knowledge_backup.csv' WITH CSV HEADER;

-- Regenerate embeddings
-- Run npm run setup-rag to rebuild embeddings
```

## Next Steps

1. **Add Domain Knowledge**: Use `/api/rag?action=add-domain&domain=your_industry`
2. **Monitor Usage**: Review analytics to understand query patterns
3. **Optimize Performance**: Tune similarity thresholds based on user feedback
4. **Expand Content**: Continuously add relevant business knowledge

## Support

For issues with RAG setup:
1. Check the troubleshooting section above
2. Review server logs for error details
3. Test individual components (database, API, embeddings)
4. Open an issue with detailed error information 