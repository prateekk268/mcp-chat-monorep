import { z } from "zod";

export const employeeInputSchema = z.object({
  name: z.string().min(1, "Name is required").describe("Name of employee"),
  email: z.string().email("Invalid email format").describe("Email of employee"),
  skill: z
    .enum([
      "Frontend",
      "Backend",
      "FullStack",
      "Marketing",
      "Project Manager",
      "Sales",
    ])
    .describe("Skill of employee"),
  experience: z
    .enum(["Intern", "Associate", "Senior"])
    .describe("Experience of the employee"),
});

export const getEmployeeSchema = z.object({
  id: z.string().min(1).describe("Unique Id assign to employee"),
});

export const updateEmployeeSchema = employeeInputSchema.extend({
  id: z.string().min(1).describe("Unique Id assign to employee"),
});

export const listEmployeeSchema = z.object({
  name: z.string().optional().describe("Search by employee name"),
  email: z.string().email().optional().describe("Search by employee email"),
  skill: z
    .enum([
      "Frontend",
      "Backend",
      "FullStack",
      "Marketing",
      "Project Manager",
      "Sales",
    ])
    .optional()
    .describe("Search by employee skill"),
  experience: z
    .enum(["Intern", "Associate", "Senior"])
    .optional()
    .describe("Search by employee experience"),
});

