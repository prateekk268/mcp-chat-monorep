import { z } from "zod";

export const todoInputSchema = z.object({
  name: z.string().min(1, "Todo name is required"),

  projectId: z.string().min(1, "Project ID is required"),

  duedate: z.string().datetime().optional().describe("Due date of Todo"),

  assignee: z.string().optional().describe("Employee Id assigned to Todo"),

  priority: z
    .enum(["low", "medium", "high"])
    .default("medium")
    .describe("Priority of Todo"),

  status: z
    .enum(["Not Started", "In Progress", "Completed"])
    .default("Not Started")
    .describe("Status of Todo"),

  description: z.string().optional(),
});

export const listtodoInputSchema = z.object({
  projectId: z.string().optional().describe("Search by projectId"),
  assignee: z.string().optional().describe("Search by assignee"),
  status: z.enum(["Not Started", "In Progress", "Completed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  name: z.string().optional().describe("Search by Todo name"),
});

export const todoGetSchema = z.object({
  id: z.string().describe("Todo ID"),
});

export const todoUpdateSchema = todoInputSchema.partial().extend({
  id: z.string().describe("Todo ID"),
});

export const todoDeleteSchema = z.object({
  id: z.string().describe("Todo ID"),
});
