import "dotenv/config";
import express from "express";
import cors from "cors";
import {
  Agent,
  run,
  MCPServerStdio,
  OpenAIConversationsSession,
} from "@openai/agents";
import { projectScopeGuardrail } from "./agent/guardAgent";

const app = express();

app.use(cors());
app.use(express.json());

const session = new OpenAIConversationsSession();

let agent: Agent | null = null;
let mcp: MCPServerStdio | null = null;

async function initAgent() {
  if (agent) return agent;

  mcp = new MCPServerStdio({
    name: "my-mcp-server",
    fullCommand: "node lib/mcp/server.js",
  });

  await mcp.connect();

  agent = new Agent({
    name: "main-agent",
    instructions: `
You are the Main Agent responsible for:
You can access the MCP resource company://info.

When the user asks for company info, policies, values, benefits, holidays, or goals:
- Fetch company://info
- Return the relevant content to the user
- Creating, listing, updating, and deleting employees
- Creating, listing, updating, and deleting projects
- Creating, listing, updating, and deleting todos/subtasks
- Interpreting user requests and mapping them to the correct MCP tools or resources
- Providing clean, readable, structured responses

When the user requests company info, policies, values, or general company details:
- Fetch the MCP resource: company://info
- Return its contents to the user

Error Handling:
- If a tool or resource returns an error, explain clearly:
  - what failed
  - why it failed
  - how the user can fix it

Behavior Rules:
- No hallucinating fields or IDs
- Ask for missing required fields when needed
- Be friendly and precise
`,
    inputGuardrails: [projectScopeGuardrail],
    mcpServers: [mcp],
    model: "gpt-4.1-mini",
  });

  return agent;
}

app.post("/chat", async (req, res) => {
  const { userMessage } = req.body;

  try {
    const agent = await initAgent();

    const result = await run(agent, userMessage, { session });
    console.log(result.finalOutput);

    return res.json({
      success: true,
      reply: result.finalOutput,
      type: "IN_SCOPE",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: err,
    });
  }
});

app.listen(process.env.PORT || 8100, () => {
  console.log(`Server is running on port ${process.env.PORT || 8100}`);
});
