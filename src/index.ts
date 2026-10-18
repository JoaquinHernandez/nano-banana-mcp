import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";

// Load environment variables if running locally
import "dotenv/config";

const server = new Server(
  {
    name: "nano-banana-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register the Nano Banana tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "generate_image",
        description: "Generate an image using the Nano Banana (gemini-2.5-flash-image) model.",
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "Highly detailed description of the image to generate.",
            },
            aspectRatio: {
              type: "string",
              description: "Aspect ratio for the image (e.g., '1:1', '16:9', '9:16', '4:3', '3:4')",
              enum: ["1:1", "16:9", "9:16", "4:3", "3:4"],
              default: "1:1"
            }
          },
          required: ["prompt"],
        },
      }
    ],
  };
});

// Handle tool execution requests from Claude
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "generate_image") {
    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new McpError(ErrorCode.InvalidRequest, "GEMINI_API_KEY environment variable is not set.");
  }

  const { prompt, aspectRatio = "1:1" } = request.params.arguments as any;

  try {
    // 1. Make the request to Google's Nano Banana (Gemini Image) API
    // Note: Adjust the payload structure if Google updates the REST schema for 2.5-flash-image
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateImages?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: { 
            sampleCount: 1, 
            aspectRatio 
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorData}`);
    }

    const data = await response.json() as any;
    
    // Extract base64 image data from the response (depends on exact API response shape)
    const base64Image = data.predictions?.[0]?.bytesBase64Encoded || data.images?.[0]?.image;

    if (!base64Image) {
      throw new Error("Failed to extract image from the API response.");
    }

    // 2. Save the image to a temporary local file so Claude/User can view it
    const outputDir = path.join(os.tmpdir(), "nano-banana-outputs");
    await fs.mkdir(outputDir, { recursive: true });
    
    const filename = `nano_banana_${Date.now()}.jpeg`;
    const filepath = path.join(outputDir, filename);
    
    await fs.writeFile(filepath, Buffer.from(base64Image, "base64"));

    // 3. Return the result to Claude
    return {
      content: [
        {
          type: "text",
          text: `Successfully generated the image!\nPrompt used: "${prompt}"\nSaved to local path: ${filepath}`,
        }
      ],
    };
  } catch (error: any) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Failed to generate image using Nano Banana. Error: ${error.message}`,
        },
      ],
    };
  }
});

// Start the stdio transport
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🍌 Nano Banana MCP Server running on stdio");
}

run().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
