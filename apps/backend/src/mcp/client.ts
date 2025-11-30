import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export const mcpclient = async()=> {
  console.log("🚀 Starting MCP client...");

  const transport = new StdioClientTransport({
    command: "node",
    args: ["./lib/mcp/server.js"],
  });

  const client = new Client({
    name: "my-test-client",
    version: "1.0.0",
  });

  await client.connect(transport);
  console.log("🟢 Connected!\n");

  // LIST TOOLS
  const tools = await client.listTools();
  console.log("📦 Tools:", tools);

  // CALL time
  const timeResult = await client.callTool({
    name: "time",
    arguments: {}
  });
  console.log("⏰ time =>", timeResult);

  // CALL greet_user
  const greetResult = await client.callTool({
    name: "greet_user",
    arguments: { name: "Prateek" }
  });
  console.log("🙋 greet_user =>", greetResult);

  client.close();
}

mcpclient().catch(console.error);
