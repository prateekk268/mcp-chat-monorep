import { server } from "../server";
import TodoModel from "../../db/schema/todoSchema";
import {
  listtodoInputSchema,
  todoDeleteSchema,
  todoGetSchema,
  todoInputSchema,
  todoUpdateSchema,
} from "../../validation/todo";
import { z } from "zod";
import { TextContent } from "@modelcontextprotocol/sdk/types.js";

const schema = (s: any) => s as any;

const text = (t: string): TextContent => ({ type: "text", text: t });

export type AddTodoInput = z.infer<typeof todoInputSchema>;
export type ListTodoInput = z.infer<typeof listtodoInputSchema>;
export type GetTodoInput = z.infer<typeof todoGetSchema>;
export type UpdateTodoInput = z.infer<typeof todoUpdateSchema>;
export type DeleteTodoInput = z.infer<typeof todoDeleteSchema>;

/* =====================================
   ADD TODO
===================================== */
server.registerTool(
  "addtodo",
  {
    title: "Add Todo",
    description: "Create a new todo task.",
    inputSchema: schema(todoInputSchema),
  },
  async (input: AddTodoInput) => {
    try {
      const todo = await TodoModel.create(input);
      return { content: [text(JSON.stringify(todo, null, 2))] };
    } catch (error: any) {
      return { content: [text(`Failed to add todo: ${error.message}`)] };
    }
  }
);

/* =====================================
   LIST TODOS
===================================== */
server.registerTool(
  "listtodos",
  {
    title: "List Todos",
    description:
      "List todos or filter by project, assignee, status, priority, or name.",
    inputSchema: schema(listtodoInputSchema),
  },
  async (input: ListTodoInput) => {
    try {
      const filter: any = {};

      if (input.projectId) filter.projectId = input.projectId;
      if (input.assignee) filter.assignee = input.assignee;
      if (input.status) filter.status = input.status;
      if (input.priority) filter.priority = input.priority;
      if (input.name) filter.name = { $regex: input.name, $options: "i" };

      const todos = await TodoModel.find(filter)
        .populate("assignee")
        .populate("projectId");

      return { content: [text(JSON.stringify(todos, null, 2))] };
    } catch (error: any) {
      return { content: [text(`Failed to list todos: ${error.message}`)] };
    }
  }
);

/* =====================================
   GET TODO
===================================== */
server.registerTool(
  "gettodo",
  {
    title: "Get Todo",
    description: "Fetch a todo by its ID.",
    inputSchema: schema(todoGetSchema),
  },
  async (input: GetTodoInput) => {
    try {
      const todo = await TodoModel.findById(input.id)
        .populate("assignee")
        .populate("projectId");

      if (!todo) return { content: [text("Todo not found.")] };

      return { content: [text(JSON.stringify(todo, null, 2))] };
    } catch (error: any) {
      return { content: [text(`Failed to get todo: ${error.message}`)] };
    }
  }
);

/* =====================================
   UPDATE TODO
===================================== */
server.registerTool(
  "updatetodo",
  {
    title: "Update Todo",
    description: "Update an existing todo.",
    inputSchema: schema(todoUpdateSchema),
  },
  async (input: UpdateTodoInput) => {
    try {
      const { id, ...data } = input;

      const updated = await TodoModel.findByIdAndUpdate(id, data, {
        new: true,
      });

      if (!updated) return { content: [text("Todo not found.")] };

      return { content: [text(JSON.stringify(updated, null, 2))] };
    } catch (error: any) {
      return { content: [text(`Failed to update todo: ${error.message}`)] };
    }
  }
);

/* =====================================
   DELETE TODO
===================================== */
server.registerTool(
  "deletetodo",
  {
    title: "Delete Todo",
    description: "Delete a todo by ID.",
    inputSchema: schema(todoDeleteSchema),
  },
  async (input: DeleteTodoInput) => {
    try {
      const deleted = await TodoModel.findByIdAndDelete(input.id);

      if (!deleted) return { content: [text("Todo not found.")] };

      return { content: [text("Todo deleted successfully.")] };
    } catch (error: any) {
      return { content: [text(`Failed to delete todo: ${error.message}`)] };
    }
  }
);
