import { z } from "zod";

export const projectInputSchema = z.object({
  name: z.string().min(1, "Project name is required"),

  assignee: z
    .string()
    .optional()
    .describe("Employee ID assigned to the project"),

  duedate: z.string().datetime().optional().describe("Due date of the project"),

  priority: z
    .enum(["low", "medium", "high"])
    .default("low")
    .describe("Priority of the project"),

  status: z
    .enum(["Not Started", "In Progress", "Completed", "On Hold"])
    .default("Not Started")
    .describe("Status of the project"),

  startedAt: z
    .string()
    .datetime()
    .optional()
    .describe("Start date of the project"),

  description: z.string().optional().describe("Project description"),
});

export const listProjectInputSchema = z.object({
  name: z.string().optional().describe("Search by name"),
  status: z
    .enum(["Not Started", "In Progress", "Completed", "On Hold"])
    .optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  assignee: z.string().optional().describe("Search by Employee ID"),
});

export const projectGetSchema = z.object({
  id: z.string().describe("Project ID"),
});

export const projectUpdateSchema = projectInputSchema.partial().extend({
  id: z.string().describe("Project ID to update"),
});

export const projectDeleteSchema = z.object({
  id: z.string().describe("Project ID"),
});
