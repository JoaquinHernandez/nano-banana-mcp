# nano-banana-mcp

# Nano Banana MCP Server 🍌

A Model Context Protocol (MCP) server that connects Claude to **Nano Banana** (Google's `gemini-2.5-flash-image` AI model), allowing Claude to seamlessly generate and edit images directly in your chat.

## Features
- **`generate_image`**: Prompt Claude to generate high-resolution images. Features adjustable aspect ratios (`1:1`, `16:9`, `9:16`, `3:4`, `4:3`).
- Saves generated images automatically to your local machine and returns the exact file path to Claude.

## Prerequisites
- Node.js (v18 or higher)
- A Google Gemini API Key (from [Google AI Studio](https://aistudio.google.com/))
- Claude Desktop App

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/nano-banana-mcp.git](https://github.com/yourusername/nano-banana-mcp.git)
   cd nano-banana-mcp
   Install dependencies and build:

Bash
npm install
npm run build
Configure Claude Desktop:
Open your Claude Desktop configuration file:

Mac: ~/Library/Application Support/Claude/claude_desktop_config.json

Windows: %APPDATA%\Claude\claude_desktop_config.json

Add the MCP server to your config (replace /path/to/repo with the actual absolute path to this folder, and insert your API key):

JSON
{
  "mcpServers": {
    "nano-banana": {
      "command": "node",
      "args": ["/path/to/repo/nano-banana-mcp/build/index.js"],
      "env": {
        "GEMINI_API_KEY": "your_actual_api_key_here"
      }
    }
  }
}
Restart Claude Desktop:
Fully quit and restart the Claude Desktop application. You will now see the generate_image tool available (look for the hammer icon ⚒️ in your chat).

Usage Example
Simply ask Claude:

"Hey Claude, use Nano Banana to generate a 16:9 image of a futuristic cyberpunk city covered in neon lights."


---

### 3. Finalizing for GitHub

1. Ensure you compile the code before pushing or running:
   ```bash
   npm run build
Create a .gitignore file so you don't commit your build files or node modules:

Plaintext
node_modules/
build/
.env
Initialize Git, commit, and push:

Bash
git init
git add .
git commit -m "Initial commit: Nano Banana MCP server"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nano-banana-mcp.git
git push -u origin main
