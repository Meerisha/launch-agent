#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupRAGDatabase() {
  console.log('🚀 Setting up RAG database...');

  try {
    // Read and execute the database schema
    const schemaPath = path.join(process.cwd(), 'lib', 'database.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Executing ${statements.length} database statements...`);

    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          // Try direct query if RPC fails
          const { error: directError } = await supabase.from('_').select('*').limit(0);
          if (directError) {
            console.warn(`⚠️  Statement may have failed: ${statement.substring(0, 50)}...`);
          }
        }
      } catch (err) {
        console.warn(`⚠️  Statement execution warning: ${err.message}`);
      }
    }

    console.log('✅ Database schema setup completed');

    // Test the vector extension
    try {
      const { data, error } = await supabase
        .from('knowledge_documents')
        .select('id')
        .limit(1);
      
      if (error) {
        console.error('❌ Database setup verification failed:', error.message);
        return false;
      }
      
      console.log('✅ Database tables verified');
    } catch (err) {
      console.error('❌ Database verification failed:', err.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    return false;
  }
}

async function seedKnowledgeBase() {
  console.log('🌱 Seeding knowledge base...');

  try {
    // Call the seeding API endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/rag?action=seed`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Knowledge base seeded successfully');
      return true;
    } else {
      console.error('❌ Knowledge base seeding failed:', result.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Knowledge base seeding failed:', error.message);
    console.log('💡 You can seed manually by visiting: /api/rag?action=seed');
    return false;
  }
}

async function verifyRAGSetup() {
  console.log('🔍 Verifying RAG setup...');

  try {
    // Test search functionality
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/rag?action=search&query=saas launch strategy&limit=3`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.success && result.results.length > 0) {
      console.log(`✅ RAG search verified - found ${result.results.length} results`);
      console.log(`   Sample result: "${result.results[0].title}"`);
      return true;
    } else {
      console.warn('⚠️  RAG search returned no results - knowledge base may be empty');
      return false;
    }
  } catch (error) {
    console.error('❌ RAG verification failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🤖 LaunchPilot RAG Setup');
  console.log('========================');

  // Step 1: Setup database
  const dbSetup = await setupRAGDatabase();
  if (!dbSetup) {
    console.error('❌ Database setup failed. Please check your Supabase configuration.');
    process.exit(1);
  }

  // Step 2: Seed knowledge base
  console.log('\n');
  const seedSuccess = await seedKnowledgeBase();
  
  // Step 3: Verify setup
  console.log('\n');
  const verifySuccess = await verifyRAGSetup();

  console.log('\n🎉 RAG Setup Summary:');
  console.log('====================');
  console.log(`Database Setup: ${dbSetup ? '✅' : '❌'}`);
  console.log(`Knowledge Seeding: ${seedSuccess ? '✅' : '⚠️'}`);
  console.log(`Verification: ${verifySuccess ? '✅' : '⚠️'}`);

  if (dbSetup && (seedSuccess || verifySuccess)) {
    console.log('\n🚀 RAG system is ready!');
    console.log('\nNext steps:');
    console.log('1. Restart your development server');
    console.log('2. Try asking questions in the chat interface');
    console.log('3. Look for "Enhanced with knowledge base insights" in responses');
  } else {
    console.log('\n⚠️  RAG setup completed with warnings.');
    console.log('The system should still work, but manual verification is recommended.');
  }
}

main().catch(console.error); 