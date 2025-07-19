import { z } from "zod";
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const InstagramImageSchema = z.object({
  projectName: z.string().describe("Name of the project/product to feature"),
  postType: z.enum([
    "product-showcase", 
    "behind-the-scenes", 
    "educational", 
    "testimonial", 
    "announcement", 
    "lifestyle",
    "quote-post"
  ]).describe("Type of Instagram post"),
  contentText: z.string().max(500).describe("Main text/message for the post"),
  brandColors: z.string().optional().describe("Brand colors (e.g., 'blue and white', 'modern purple')"),
  style: z.enum([
    "minimalist", 
    "modern", 
    "corporate", 
    "playful", 
    "elegant", 
    "tech",
    "lifestyle"
  ]).describe("Visual style preference"),
  targetAudience: z.string().describe("Target audience for the post"),
  includeText: z.boolean().default(true).describe("Whether to include text overlay on image"),
  aspectRatio: z.enum(["square", "portrait", "story"]).default("square").describe("Instagram format")
});

export const instagramImageGeneratorTool = {
  name: "generate_instagram_images",
  description: "Generate branded Instagram feed images using AI with customizable styles and content",
  inputSchema: InstagramImageSchema,
  handler: async (input: z.infer<typeof InstagramImageSchema>) => {
    try {
      const images = await generateInstagramImages(input);
      return {
        project: input.projectName,
        postType: input.postType,
        images: images,
        suggestions: generatePostSuggestions(input),
        hashtags: generateHashtags(input.projectName, input.targetAudience),
        captions: generateCaptions(input)
      };
    } catch (error) {
      throw new Error(`Image generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};

async function generateInstagramImages(input: z.infer<typeof InstagramImageSchema>) {
  const prompts = createImagePrompts(input);
  const images = [];

  for (const prompt of prompts) {
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        size: getImageSize(input.aspectRatio),
        quality: "hd",
        style: input.style === "playful" ? "vivid" : "natural"
      });

      if (response.data && response.data[0]) {
        images.push({
          url: response.data[0].url,
          prompt: prompt,
          revisedPrompt: response.data[0].revised_prompt,
          format: input.aspectRatio
        });
      }
    } catch (error) {
      console.error('Error generating image:', error);
      images.push({
        error: `Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`,
        prompt: prompt
      });
    }
  }

  return images;
}

function createImagePrompts(input: z.infer<typeof InstagramImageSchema>) {
  const photographyStyle = getPhotographyStyle(input.style);
  const colorScheme = input.brandColors || "natural, professional color palette";
  const contentFocus = getRealisticContentFocus(input.postType);
  const lightingSetup = getLightingSetup(input.style);
  const cameraSettings = getCameraSettings(input.aspectRatio);
  
  const prompts = [];

  // Main realistic post image
  const mainPrompt = `Professional product photography for ${input.projectName} Instagram post. 
    ${photographyStyle} ${lightingSetup} ${cameraSettings}
    Scene: ${contentFocus} featuring "${input.contentText}".
    Colors: ${colorScheme} with natural color grading.
    Target audience: ${input.targetAudience}.
    ${input.includeText ? `Include elegant, readable text overlay: "${input.contentText}"` : 'No text overlay, focus on pure visual storytelling'}.
    
    REALISM REQUIREMENTS:
    - Shot with professional DSLR camera (Canon 5D Mark IV or Sony A7R IV)
    - Perfect focus and depth of field
    - Natural skin tones and realistic lighting
    - No obvious AI artifacts or unrealistic elements
    - Authentic human expressions and body language
    - Realistic product placement and interactions
    - Professional retouching but maintain natural look
    - High-end commercial photography quality
    - Believable real-world setting and props
    
    Style: Hyper-realistic commercial photography, indistinguishable from professional photoshoot.`;
  
  prompts.push(mainPrompt);

  // Alternative realistic version
  const altPrompt = `Alternative professional lifestyle photography for ${input.projectName} Instagram. 
    ${photographyStyle} ${lightingSetup} Different composition and angle from first shot.
    Scene: ${contentFocus} in authentic real-world environment.
    Message concept: "${input.contentText}".
    
    PHOTOGRAPHIC SPECIFICATIONS:
    - ${cameraSettings}
    - Natural environmental lighting mixed with professional fill light
    - Authentic model expressions and genuine interactions
    - Real product usage scenarios
    - Professional color correction and grading
    - Sharp details with natural bokeh where appropriate
    - Realistic shadows and highlights
    - No synthetic or obviously computer-generated elements
    
    Result: Magazine-quality lifestyle photography that looks like a real professional photoshoot for ${input.targetAudience}.`;
  
  prompts.push(altPrompt);

  return prompts;
}

function getPhotographyStyle(style: string): string {
  const styles: Record<string, string> = {
    minimalist: "Clean studio photography with seamless white backdrop, professional lighting setup, minimal props",
    modern: "Contemporary lifestyle photography with sleek modern interior, natural window light mixed with studio strobes",
    corporate: "Professional corporate photography with office environment, business attire, confident poses, clean backgrounds",
    playful: "Vibrant lifestyle photography with dynamic poses, colorful backgrounds, natural expressions, candid moments",
    elegant: "Luxury lifestyle photography with premium locations, sophisticated styling, soft natural lighting, refined aesthetics",
    tech: "Modern tech product photography with sleek surfaces, cool lighting, professional models using devices naturally",
    lifestyle: "Authentic lifestyle photography in real environments, natural lighting, genuine human interactions, documentary style"
  };
  return styles[style] || "Professional commercial photography with natural lighting";
}

function getRealisticContentFocus(postType: string): string {
  const focuses: Record<string, string> = {
    "product-showcase": "Professional product photography showing real person authentically using or interacting with the product in natural environment",
    "behind-the-scenes": "Candid documentary-style photography capturing genuine behind-the-scenes moments, real workspace, authentic team interactions",
    "educational": "Clean instructional photography with real people demonstrating concepts, natural teaching environment, authentic learning scenarios",
    "testimonial": "Authentic portrait photography of real satisfied customer, genuine expression, natural setting that reflects their lifestyle",
    "announcement": "Professional announcement photography with real celebration or reveal moment, authentic excitement, natural reactions",
    "lifestyle": "Genuine lifestyle photography showing product naturally integrated into real daily life, authentic home or work environment",
    "quote-post": "Artistic typography photography with real-world backgrounds, natural textures, professional lettering that looks hand-crafted or printed"
  };
  return focuses[postType] || "Professional lifestyle photography with authentic real-world scenario";
}

function getLightingSetup(style: string): string {
  const lighting: Record<string, string> = {
    minimalist: "Soft diffused studio lighting with key light and fill light, minimal shadows, even exposure",
    modern: "Mixed natural and artificial lighting, large windows with soft box fill, contemporary mood",
    corporate: "Professional business lighting, clean key light with subtle fill, confidence-inspiring setup",
    playful: "Dynamic lighting with warm tones, natural sunlight or vibrant artificial lighting, energetic mood",
    elegant: "Soft natural lighting or luxury studio setup, golden hour tones, sophisticated rim lighting",
    tech: "Cool-toned professional lighting, LED panels, clean highlights on tech products, modern aesthetic",
    lifestyle: "Natural environmental lighting, golden hour or soft indoor light, authentic atmospheric conditions"
  };
  return lighting[style] || "Professional natural lighting with studio fill";
}

function getCameraSettings(aspectRatio: string): string {
  const settings: Record<string, string> = {
    square: "Shot with 85mm lens at f/2.8, ISO 200, 1/250s shutter speed, perfect square composition",
    portrait: "Shot with 50mm lens at f/1.8, ISO 100, 1/320s shutter speed, vertical composition optimized for mobile viewing",
    story: "Shot with 35mm lens at f/2.2, ISO 160, 1/250s shutter speed, vertical story format composition"
  };
  return settings[aspectRatio] || "Shot with 50mm lens at f/2.8, ISO 200, 1/250s shutter speed";
}

function getImageSize(aspectRatio: string): "1024x1024" | "1024x1792" | "1792x1024" {
  const sizes: Record<string, "1024x1024" | "1024x1792" | "1792x1024"> = {
    square: "1024x1024",      // 1:1 for feed posts
    portrait: "1024x1792",    // 9:16 for reels/stories
    story: "1024x1792"        // 9:16 for stories
  };
  return sizes[aspectRatio] || "1024x1024";
}

function generatePostSuggestions(input: z.infer<typeof InstagramImageSchema>) {
  return {
    bestTimeToPost: getBestPostingTime(input.targetAudience),
    engagementTips: [
      "Ask a question in your caption to encourage comments",
      "Use the first 125 characters of your caption wisely - they show without 'more'",
      "Include a clear call-to-action",
      "Tag relevant accounts and locations",
      "Post when your audience is most active"
    ],
    contentSeries: `Consider creating a series of ${input.postType} posts to build consistency`,
    crossPlatform: "Repurpose this design for other platforms with adjusted dimensions"
  };
}

function getBestPostingTime(audience: string): string {
  // Simplified logic - in real implementation, could be more sophisticated
  if (audience.toLowerCase().includes("business") || audience.toLowerCase().includes("professional")) {
    return "Tuesday-Thursday, 11 AM - 1 PM or 5 PM - 7 PM";
  } else if (audience.toLowerCase().includes("student") || audience.toLowerCase().includes("young")) {
    return "Monday-Friday, 6 PM - 9 PM or weekends 12 PM - 3 PM";
  } else {
    return "Tuesday-Friday, 11 AM - 1 PM and 7 PM - 9 PM";
  }
}

function generateHashtags(projectName: string, audience: string): string[] {
  const baseHashtags = [
    "#entrepreneur", "#startup", "#business", "#innovation"
  ];
  
  const audienceHashtags = generateAudienceHashtags(audience);
  const projectHashtags = generateProjectHashtags(projectName);
  
  return [...baseHashtags, ...audienceHashtags, ...projectHashtags].slice(0, 20);
}

function generateAudienceHashtags(audience: string): string[] {
  const audienceLower = audience.toLowerCase();
  
  if (audienceLower.includes("business")) return ["#smallbusiness", "#businessowner", "#entrepreneur"];
  if (audienceLower.includes("tech")) return ["#tech", "#software", "#digital"];
  if (audienceLower.includes("fitness")) return ["#fitness", "#health", "#wellness"];
  if (audienceLower.includes("creative")) return ["#creative", "#design", "#art"];
  
  return ["#lifestyle", "#community", "#growth"];
}

function generateProjectHashtags(projectName: string): string[] {
  const name = projectName.toLowerCase();
  
  if (name.includes("app")) return ["#app", "#mobile", "#technology"];
  if (name.includes("saas")) return ["#saas", "#software", "#productivity"];
  if (name.includes("course")) return ["#onlinecourse", "#education", "#learning"];
  if (name.includes("service")) return ["#service", "#consulting", "#professional"];
  
  return ["#product", "#launch", "#innovation"];
}

function generateCaptions(input: z.infer<typeof InstagramImageSchema>): Array<{type: string; text: string; length: number}> {
  const captions = [];
  
  // Short caption version
  const shortCaption = `${input.contentText} 🚀
  
What do you think? Let me know in the comments! 👇
  
#${input.projectName.replace(/\s+/g, '').toLowerCase()} #entrepreneur`;
  
  captions.push({
    type: "short",
    text: shortCaption,
    length: shortCaption.length
  });
  
  // Long caption version
  const longCaption = `${input.contentText}
  
Here's why this matters for ${input.targetAudience}:
  
✨ It solves a real problem
✨ It's designed with you in mind  
✨ It delivers actual value
  
What's your experience with this? Share your thoughts below! 👇
  
---
Follow @${input.projectName.replace(/\s+/g, '').toLowerCase()} for more updates!
  
#${input.projectName.replace(/\s+/g, '').toLowerCase()} #startup #entrepreneur #innovation`;
  
  captions.push({
    type: "long",
    text: longCaption,
    length: longCaption.length
  });
  
  return captions;
} 