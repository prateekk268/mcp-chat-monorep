import {
  Agent,
  run,
  InputGuardrailTripwireTriggered,
  InputGuardrail,
} from "@openai/agents";
import { z } from "zod";

export const guardrailAgent = new Agent({
  name: "scope-classifier",
  instructions: `
You are a strict classifier and prompt improver.
`,
  model: "gpt-4.1-nano",

  outputType: z.object({
    improvePrompt: z.string()
  }),
});

export const projectScopeGuardrail: InputGuardrail = {
  name: "project_scope_guardrail",
  execute: async ({ input, context }) => {
    const result = await run(guardrailAgent, input, { context });

    return {
      outputInfo: result.finalOutput,
      tripwireTriggered: false,
    };
  },
};

export const helpAgent = new Agent({
  name: "help-agent",
  model: "gpt-4.1-mini",
  instructions: `
You are a friendly assistant who handles OUT-OF-SCOPE queries.

When a user asks something unrelated to employees, projects, or todos:
- Do NOT scold them.
- Simply explain politely what services ARE supported.
- Provide short examples of valid requests.

Your tone: warm, simple, welcoming.

ALLOWED SERVICES:
- Manage employees
- Manage projects
- Manage todos and subtasks
`,
});