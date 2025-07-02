#!/usr/bin/env node

import { config } from 'dotenv';
import { spawn } from 'child_process';
import { readFileSync } from 'fs';

// Load environment variables
config({ path: '.env.local' });

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;

if (!FIRECRAWL_API_KEY) {
    console.error('❌ FIRECRAWL_API_KEY not found in .env.local');
    process.exit(1);
}

console.log('🔥 Testing Firecrawl API Key...');
console.log(`API Key: ${FIRECRAWL_API_KEY.slice(0, 10)}...${FIRECRAWL_API_KEY.slice(-8)}`);

// Test the API by making a simple scrape request
async function testFirecrawlAPI() {
    try {
        const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: 'https://example.com',
                formats: ['markdown']
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Firecrawl API Key is VALID!');
            console.log('🎉 Successfully scraped test page');
            console.log('📊 Response preview:', data.data?.markdown?.slice(0, 200) + '...');
            
            // Check credit usage if available
            if (data.metadata?.creditUsage) {
                console.log('💳 Credits used for this request:', data.metadata.creditUsage);
            }
        } else {
            console.error('❌ API Error:', data.error || data.message);
            if (response.status === 401) {
                console.error('🔑 Invalid API key');
            } else if (response.status === 402) {
                console.error('💰 Insufficient credits');
            }
        }
    } catch (error) {
        console.error('❌ Network error:', error.message);
    }
}

testFirecrawlAPI(); 