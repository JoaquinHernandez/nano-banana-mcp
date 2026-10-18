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
