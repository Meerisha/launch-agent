import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { getCachedData, setCachedData } from './redis';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface KnowledgeDocument {
  id?: string;
  title: string;
  content: string;
  document_type: 'industry_insight' | 'launch_strategy' | 'market_research' | 'case_study' | 'framework' | 'best_practice';
  category: string; // 'saas', 'ecommerce', 'consulting', 'general', etc.
  subcategory?: string;
  source?: string;
  tags: string[];
  metadata?: Record<string, any>;
}

export interface SearchResult {
  document_id: string;
  title: string;
  content: string;
  chunk_text: string;
  document_type: string;
  category: string;
  similarity: number;
  tags: string[];
}

export interface RAGContext {
  query: string;
  results: SearchResult[];
  context_summary: string;
  source_count: number;
}

/**
 * Generate embeddings for text using OpenAI's ada-002 model
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text.replace(/\n/g, ' ').substring(0, 8191), // OpenAI's max input length
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

/**
 * Split large documents into smaller chunks for better embedding
 */
export function chunkDocument(content: string, maxChunkSize: number = 1000): string[] {
  const sentences = content.split(/[.!?]+/);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length < maxChunkSize) {
      currentChunk += sentence + '. ';
    } else {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = sentence + '. ';
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter(chunk => chunk.length > 50); // Filter out very short chunks
}

/**
 * Store a knowledge document with embeddings
 */
export async function storeKnowledgeDocument(document: KnowledgeDocument): Promise<string> {
  try {
    // Insert the document
    const { data: docData, error: docError } = await supabase
      .from('knowledge_documents')
      .insert({
        title: document.title,
        content: document.content,
        document_type: document.document_type,
        category: document.category,
        subcategory: document.subcategory,
        source: document.source,
        tags: document.tags,
        metadata: document.metadata || {}
      })
      .select('id')
      .single();

    if (docError) throw docError;

    const documentId = docData.id;

    // Chunk the document content
    const chunks = chunkDocument(document.content);
    
    // Generate embeddings for each chunk
    const embeddings = await Promise.all(
      chunks.map(async (chunk, index) => {
        const embedding = await generateEmbedding(chunk);
        return {
          document_id: documentId,
          embedding: `[${embedding.join(',')}]`, // Format for PostgreSQL vector type
          chunk_index: index,
          chunk_text: chunk
        };
      })
    );

    // Store embeddings
    const { error: embeddingError } = await supabase
      .from('document_embeddings')
      .insert(embeddings);

    if (embeddingError) throw embeddingError;

    return documentId;
  } catch (error) {
    console.error('Error storing knowledge document:', error);
    throw new Error('Failed to store knowledge document');
  }
}

/**
 * Search for similar documents using semantic search
 */
export async function searchKnowledgeBase(
  query: string,
  options: {
    maxResults?: number;
    threshold?: number;
    category?: string;
    documentType?: string;
  } = {}
): Promise<SearchResult[]> {
  const {
    maxResults = 5,
    threshold = 0.7,
    category,
    documentType
  } = options;

  try {
    // Check cache first
    const cacheKey = `rag_search:${query}:${category || 'all'}:${documentType || 'all'}:${maxResults}`;
    const cached = await getCachedData(cacheKey);
    if (cached) {
      return cached as SearchResult[];
    }

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Search for similar documents using the database function
    const { data, error } = await supabase.rpc('search_similar_documents', {
      query_embedding: `[${queryEmbedding.join(',')}]`,
      match_threshold: threshold,
      match_count: maxResults,
      filter_category: category || null,
      filter_type: documentType || null
    });

    if (error) throw error;

    const results = data || [];

    // Cache results for 30 minutes
    await setCachedData(cacheKey, results, { ttl: 1800 });

    return results;
  } catch (error) {
    console.error('Error searching knowledge base:', error);
    return [];
  }
}

/**
 * Get RAG context for a user query
 */
export async function getRAGContext(
  query: string,
  projectContext: {
    industry?: string;
    projectType?: string;
    category?: string;
  } = {}
): Promise<RAGContext> {
  try {
    // Determine search parameters based on project context
    const searchOptions = {
      maxResults: 8,
      threshold: 0.75,
      category: projectContext.category || projectContext.industry,
      documentType: undefined as string | undefined
    };

    // Enhance query with context keywords
    let enhancedQuery = query;
    if (projectContext.industry) {
      enhancedQuery += ` ${projectContext.industry}`;
    }
    if (projectContext.projectType) {
      enhancedQuery += ` ${projectContext.projectType}`;
    }

    // Search for relevant documents
    const results = await searchKnowledgeBase(enhancedQuery, searchOptions);

    // Create context summary
    const contextSummary = createContextSummary(results, query);

    return {
      query: enhancedQuery,
      results,
      context_summary: contextSummary,
      source_count: results.length
    };
  } catch (error) {
    console.error('Error getting RAG context:', error);
    return {
      query,
      results: [],
      context_summary: '',
      source_count: 0
    };
  }
}

/**
 * Create a summary of retrieved context for the AI
 */
function createContextSummary(results: SearchResult[], query: string): string {
  if (results.length === 0) {
    return 'No specific knowledge base articles found for this query.';
  }

  const grouped = results.reduce((acc, result) => {
    const type = result.document_type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  let summary = `Found ${results.length} relevant knowledge base articles:\n\n`;

  Object.entries(grouped).forEach(([type, docs]) => {
    summary += `## ${type.replace('_', ' ').toUpperCase()}\n`;
    docs.forEach((doc, index) => {
      summary += `${index + 1}. **${doc.title}** (${doc.category})\n`;
      summary += `   ${doc.chunk_text.substring(0, 200)}...\n`;
      if (doc.tags.length > 0) {
        summary += `   Tags: ${doc.tags.join(', ')}\n`;
      }
      summary += '\n';
    });
  });

  return summary;
}

/**
 * Log user query for analytics and improvement
 */
export async function logRAGQuery(
  userId: string | null,
  query: string,
  retrievedDocuments: string[],
  responseGenerated: boolean = true
): Promise<void> {
  try {
    if (!userId) return; // Skip logging for anonymous users

    await supabase
      .from('rag_query_history')
      .insert({
        user_id: userId,
        query,
        retrieved_documents: retrievedDocuments,
        response_generated: responseGenerated
      });
  } catch (error) {
    console.error('Error logging RAG query:', error);
    // Don't throw error as this is non-critical
  }
}

/**
 * Get popular queries for analytics
 */
export async function getPopularQueries(limit: number = 10): Promise<Array<{query: string, count: number}>> {
  try {
    const { data, error } = await supabase
      .from('rag_query_history')
      .select('query')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Count query frequency
    const queryCounts = (data || []).reduce((acc, { query }) => {
      acc[query] = (acc[query] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(queryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([query, count]) => ({ query, count }));
  } catch (error) {
    console.error('Error getting popular queries:', error);
    return [];
  }
} 