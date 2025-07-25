const OpenAI = require('openai');

// Test script to debug Instagram image generation
async function testInstagramGeneration() {
  console.log('🧪 Testing Instagram image generation...');
  
  // Check if API key exists
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY environment variable not found');
    return;
  }
  
  console.log('✅ OpenAI API key found');
  
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    console.log('🎨 Attempting to generate test image...');
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Professional product photography for LaunchPilot Instagram post. Modern minimalist style with clean lighting. Scene: Tech startup announcement featuring innovative AI consultant platform. Colors: modern blue and white with natural color grading. High-end commercial photography quality.",
      size: "1024x1024",
      quality: "hd",
      style: "natural"
    });

    if (response.data && response.data[0]) {
      console.log('✅ Image generated successfully!');
      console.log('📸 Image URL:', response.data[0].url);
      console.log('✏️ Revised prompt:', response.data[0].revised_prompt);
    } else {
      console.log('❌ No image data returned');
    }
    
  } catch (error) {
    console.error('❌ Error generating image:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error type:', error.type);
    
    if (error.status) {
      console.error('HTTP status:', error.status);
    }
  }
}

testInstagramGeneration(); 