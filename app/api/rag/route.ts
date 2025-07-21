import { NextRequest, NextResponse } from 'next/server';
import { 
  storeKnowledgeDocument, 
  searchKnowledgeBase, 
  getRAGContext,
  KnowledgeDocument 
} from '../../../lib/rag';
import { seedKnowledgeBase, addDomainKnowledge } from '../../../lib/knowledge-seeder';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const query = searchParams.get('query');
  const category = searchParams.get('category');
  const type = searchParams.get('type');

  try {
    if (action === 'search' && query) {
      // Search the knowledge base
      const results = await searchKnowledgeBase(query, {
        maxResults: parseInt(searchParams.get('limit') || '5'),
        threshold: parseFloat(searchParams.get('threshold') || '0.7'),
        category: category || undefined,
        documentType: type || undefined
      });

      return NextResponse.json({
        success: true,
        results,
        count: results.length
      });
    }

    if (action === 'context' && query) {
      // Get full RAG context
      const context = await getRAGContext(query, {
        industry: searchParams.get('industry') || undefined,
        category: category || undefined,
        projectType: searchParams.get('projectType') || undefined
      });

      return NextResponse.json({
        success: true,
        context
      });
    }

    if (action === 'seed') {
      // Seed the knowledge base (admin operation)
      await seedKnowledgeBase();
      return NextResponse.json({
        success: true,
        message: 'Knowledge base seeded successfully'
      });
    }

    if (action === 'add-domain') {
      const domain = searchParams.get('domain');
      if (!domain) {
        return NextResponse.json(
          { error: 'Domain parameter required' },
          { status: 400 }
        );
      }
      
      await addDomainKnowledge(domain);
      return NextResponse.json({
        success: true,
        message: `Added ${domain} knowledge successfully`
      });
    }

    return NextResponse.json(
      { error: 'Invalid action parameter' },
      { status: 400 }
    );

  } catch (error) {
    console.error('RAG API error:', error);
    return NextResponse.json(
      { error: 'Failed to process RAG request' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, document } = body;

    if (action === 'store' && document) {
      // Store a new knowledge document
      const docId = await storeKnowledgeDocument(document as KnowledgeDocument);
      
      return NextResponse.json({
        success: true,
        documentId: docId,
        message: 'Document stored successfully'
      });
    }

    if (action === 'batch-store' && body.documents) {
      // Store multiple documents
      const results = [];
      for (const doc of body.documents) {
        try {
          const docId = await storeKnowledgeDocument(doc);
          results.push({ success: true, documentId: docId, title: doc.title });
                 } catch (error) {
           results.push({ success: false, error: (error as Error).message, title: doc.title });
         }
      }

      return NextResponse.json({
        success: true,
        results,
        message: `Processed ${body.documents.length} documents`
      });
    }

    return NextResponse.json(
      { error: 'Invalid action or missing data' },
      { status: 400 }
    );

  } catch (error) {
    console.error('RAG POST API error:', error);
    return NextResponse.json(
      { error: 'Failed to process RAG request' },
      { status: 500 }
    );
  }
} 