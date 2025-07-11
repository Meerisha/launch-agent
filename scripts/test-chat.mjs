#!/usr/bin/env node

const baseUrl = process.argv[2] || 'http://localhost:3000';

async function testChatAPI() {
  console.log('🔄 Testing Chat API...\n');

  try {
    // Test 1: Basic chat message
    console.log('1. Testing basic chat message...');
    const response1 = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello, I have an idea for a SaaS product',
        conversationHistory: [],
        context: {}
      })
    });

    if (!response1.ok) {
      throw new Error(`Chat API failed: ${response1.status}`);
    }

    const data1 = await response1.json();
    console.log('   ✅ Basic chat response received');
    console.log('   📝 Response preview:', data1.response.substring(0, 100) + '...');

    // Test 2: Chat with context
    console.log('\n2. Testing chat with context...');
    const response2 = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'I want to build a project management tool for small teams',
        conversationHistory: [
          { role: 'user', content: 'Hello, I have an idea for a SaaS product' },
          { role: 'assistant', content: data1.response }
        ],
        context: data1.context || {}
      })
    });

    if (!response2.ok) {
      throw new Error(`Chat API with context failed: ${response2.status}`);
    }

    const data2 = await response2.json();
    console.log('   ✅ Chat with context response received');
    console.log('   📝 Context updated:', !!data2.context);

    // Test 3: Request analysis
    console.log('\n3. Testing analysis request...');
    const response3 = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Can you provide a complete analysis of my project management tool for small teams?',
        conversationHistory: [
          { role: 'user', content: 'Hello, I have an idea for a SaaS product' },
          { role: 'assistant', content: data1.response },
          { role: 'user', content: 'I want to build a project management tool for small teams' },
          { role: 'assistant', content: data2.response }
        ],
        context: {
          projectName: 'TeamFlow',
          targetAudience: 'small teams',
          elevatorPitch: 'A project management tool for small teams'
        }
      })
    });

    if (!response3.ok) {
      throw new Error(`Analysis request failed: ${response3.status}`);
    }

    const data3 = await response3.json();
    console.log('   ✅ Analysis request response received');
    console.log('   📊 Analysis generated:', !!data3.analysis);

    // Test 4: Error handling
    console.log('\n4. Testing error handling...');
    const response4 = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: '',
        conversationHistory: [],
        context: {}
      })
    });

    if (response4.status === 400) {
      console.log('   ✅ Error handling working correctly (empty message)');
    } else {
      console.log('   ❌ Error handling not working properly');
    }

    console.log('\n🎉 All chat API tests completed!');
    console.log('✅ Chat interface is ready for interactive use');

  } catch (error) {
    console.error('❌ Chat API test failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('🔧 Make sure the development server is running:');
      console.error('   npm run dev');
    } else if (error.message.includes('401') || error.message.includes('403')) {
      console.error('🔑 Check your API keys in .env.local');
    }
    
    process.exit(1);
  }
}

testChatAPI(); 