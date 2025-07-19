import { NextRequest, NextResponse } from 'next/server';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import {
  projectIntakeTool,
  launchStrategyTool,
  revenueCalculatorTool,
  competitiveIntelligence,
  socialMediaStrategyTool,
  instagramImageGeneratorTool
} from '../../../tools/index';

// MCP Tools Registry with proper typing
const mcpTools: Record<string, any> = {
  'project_intake_analysis': projectIntakeTool,
  'generate_launch_strategy': launchStrategyTool,
  'calculate_revenue_projections': revenueCalculatorTool,
  'competitive_intelligence_analysis': competitiveIntelligence,
  'generate_social_media_strategy': socialMediaStrategyTool,
  'generate_instagram_images': instagramImageGeneratorTool
};

// Create MCP Server
const server = new Server(
  {
    name: 'launch-pilot-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: Object.entries(mcpTools).map(([name, tool]) => ({
      name,
      description: tool.description,
      inputSchema: tool.inputSchema
    }))
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  if (!mcpTools[name]) {
    throw new Error(`Unknown tool: ${name}`);
  }

  try {
    const result = await mcpTools[name].handler(args);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  } catch (error) {
    throw new Error(`Tool execution failed: ${error.message}`);
  }
});

// HTTP endpoint for MCP communication
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle MCP protocol messages
    if (body.method === 'tools/list') {
      const tools = Object.entries(mcpTools).map(([name, tool]) => ({
        name,
        description: tool.description,
        inputSchema: tool.inputSchema
      }));
      
      return NextResponse.json({
        jsonrpc: '2.0',
        id: body.id,
        result: { tools }
      });
    }
    
    if (body.method === 'tools/call') {
      const { name, arguments: args } = body.params;
      
      if (!mcpTools[name]) {
        return NextResponse.json({
          jsonrpc: '2.0',
          id: body.id,
          error: {
            code: -32601,
            message: `Unknown tool: ${name}`
          }
        });
      }
      
      try {
        const result = await mcpTools[name].handler(args);
        return NextResponse.json({
          jsonrpc: '2.0',
          id: body.id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          }
        });
      } catch (error) {
        return NextResponse.json({
          jsonrpc: '2.0',
          id: body.id,
          error: {
            code: -32603,
            message: `Tool execution failed: ${error.message}`
          }
        });
      }
    }
    
    // Handle initialize request
    if (body.method === 'initialize') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id: body.id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: 'LaunchPilot MCP Server',
            version: '1.0.0'
          }
        }
      });
    }
    
    return NextResponse.json({
      jsonrpc: '2.0',
      id: body.id,
      error: {
        code: -32601,
        message: 'Method not found'
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      jsonrpc: '2.0',
      error: {
        code: -32700,
        message: 'Parse error'
      }
    }, { status: 400 });
  }
}

// GET endpoint for tool discovery
export async function GET() {
  const tools = Object.entries(mcpTools).map(([name, tool]) => ({
    name,
    description: tool.description,
    inputSchema: tool.inputSchema
  }));
  
  return NextResponse.json({
    server: 'LaunchPilot MCP Server',
    version: '1.0.0',
    tools,
    endpoints: {
      tools: '/api/mcp',
      docs: '/docs/mcp'
    }
  });
} 