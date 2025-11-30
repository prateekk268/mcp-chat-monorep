import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { TextContent } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import fs from "fs";
import path from "path";

export const server = new McpServer({
  name: "my-mcp-server",
  version: "1.0.0",
});

import "./tools/employeetools";
import "./tools/projecttools";
import "./tools/todotools";

const text = (t: string): TextContent => ({ type: "text", text: t });

export const mcpserver = async () => {
  server.registerTool(
    "time",
    {
      title: "Time Tool",
      description: "Returns the current server time",

      // Prevent Zod → MCP → TS recursion issues
      inputSchema: z.object({}) as any,
      outputSchema: z.object({ time: z.string() }) as any,
    },
    async () => {
      const output = { time: new Date().toISOString() };

      return {
        content: [text(JSON.stringify(output))],
        structuredContent: output,
      };
    }
  );

  const greetInput = z.object({ name: z.string() });
  const greetOutput = z.object({ message: z.string() });

  server.registerTool(
    "greet_user",
    {
      title: "Greet User",
      description: "Greets the user",

      // Disable deep inference
      inputSchema: greetInput as any,
      outputSchema: greetOutput as any,
    },
    async (input: unknown) => {
      const parsed = greetInput.parse(input);
      const output = { message: `Hello, ${parsed.name}!` };

      return {
        content: [text(output.message)],
        structuredContent: output,
      };
    }
  );

  server.registerResource(
    "company",
    "company://info",
    {
      title: "Company Information",
      description:
        "Provides company details including values, policies, benefits, and holiday rules.",
      mimeType: "text/plain",
    },
    async (uri) => {
      try {
        const filePath = path.resolve(process.cwd(), "resources/company.txt");
        const data = fs.readFileSync(filePath, "utf-8");

        return {
          contents: [
            {
              uri: uri.href,
              text: data,
            },
          ],
        };
      } catch (err) {
        console.error("Error loading company.txt:", err);

        return {
          contents: [
            {
              uri: uri.href,
              text: "Error: Unable to load company information.",
            },
          ],
        };
      }
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("🚀 MCP server running (stdio). DO NOT EXIT.");
};

mcpserver();
