import { server } from "../server";
import ProjectModel from "../../db/schema/projectSchema";
import {
  listProjectInputSchema,
  projectDeleteSchema,
  projectGetSchema,
  projectInputSchema,
  projectUpdateSchema,
} from "../../validation/project";
import { z } from "zod";
import { TextContent } from "@modelcontextprotocol/sdk/types.js";

const schema = (s: any) => s as any;

const text = (t: string): TextContent => ({ type: "text", text: t });

export type AddProjectInput = z.infer<typeof projectInputSchema>;
export type ListProjectInput = z.infer<typeof listProjectInputSchema>;
export type GetProjectInput = z.infer<typeof projectGetSchema>;
export type UpdateProjectInput = z.infer<typeof projectUpdateSchema>;
export type DeleteProjectInput = z.infer<typeof projectDeleteSchema>;

server.registerTool(
  "addproject",
  {
    title: "Add New Project",
    description: "Create a new project.",
    inputSchema: schema(projectInputSchema),
  },
  async (input: AddProjectInput) => {
    try {
      const project = await ProjectModel.create(input);
      return { content: [text(JSON.stringify(project, null, 2))] };
    } catch (error: any) {
      return { content: [text(`Failed to add project: ${error.message}`)] };
    }
  }
);

server.registerTool(
  "listprojects",
  {
    title: "List Projects",
    description: "List all projects or filter by name, status, or priority.",
    inputSchema: schema(listProjectInputSchema),
  },
  async (input: ListProjectInput) => {
    try {
      const filter: any = {};

      if (input.name) filter.name = { $regex: input.name, $options: "i" };
      if (input.status) filter.status = input.status;
      if (input.priority) filter.priority = input.priority;
      if (input.assignee) filter.assignee = input.assignee;

      const projects = await ProjectModel.find(filter).populate("assignee");

      return { content: [text(JSON.stringify(projects, null, 2))] };
    } catch (error: any) {
      return { content: [text(`Failed to list projects: ${error.message}`)] };
    }
  }
);

server.registerTool(
  "getproject",
  {
    title: "Get Project",
    description: "Get details of a single project.",
    inputSchema: schema(projectGetSchema),
  },
  async (input: GetProjectInput) => {
    try {
      const project = await ProjectModel.findById(input.id).populate(
        "assignee"
      );

      if (!project) return { content: [text("Project not found.")] };

      return { content: [text(JSON.stringify(project, null, 2))] };
    } catch (error: any) {
      return { content: [text(`Failed to get project: ${error.message}`)] };
    }
  }
);

server.registerTool(
  "updateproject",
  {
    title: "Update Project",
    description: "Update an existing project.",
    inputSchema: schema(projectUpdateSchema),
  },
  async (input: UpdateProjectInput) => {
    try {
      const { id, ...rest } = input;

      const updated = await ProjectModel.findByIdAndUpdate(id, rest, {
        new: true,
      });

      if (!updated) return { content: [text("Project not found.")] };

      return { content: [text(JSON.stringify(updated, null, 2))] };
    } catch (error: any) {
      return {
        content: [text(`Failed to update project: ${error.message}`)],
      };
    }
  }
);

server.registerTool(
  "deleteproject",
  {
    title: "Delete Project",
    description: "Delete a project using its ID.",
    inputSchema: schema(projectDeleteSchema),
  },
  async (input: DeleteProjectInput) => {
    try {
      const deleted = await ProjectModel.findByIdAndDelete(input.id);

      if (!deleted) return { content: [text("Project not found.")] };

      return { content: [text("Project deleted successfully.")] };
    } catch (error: any) {
      return { content: [text(`Failed to delete project: ${error.message}`)] };
    }
  }
);
