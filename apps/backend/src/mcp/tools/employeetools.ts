import { server } from "../server";
import EmployeeModel from "../../db/schema/employeeSchema";
import {
  employeeInputSchema,
  getEmployeeSchema,
  listEmployeeSchema,
  updateEmployeeSchema,
} from "../../validation/employee";
import { conectDB } from "../../db/connect";
import { TextContent } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

const schema = (s: any) => s as any;

const text = (t: string): TextContent => ({ type: "text", text: t });

export type AddEmployeeInput = z.infer<typeof employeeInputSchema>;
export type ListEmployeeInput = z.infer<typeof listEmployeeSchema>;
export type GetEmployeeInput = z.infer<typeof getEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;

server.registerTool(
  "addemployee",
  {
    title: "Add New Employee",
    description: "Create a new employee record in the database.",
    inputSchema: schema(employeeInputSchema),
  },
  async (input: AddEmployeeInput) => {
    await conectDB();
    try {
      const existing = await EmployeeModel.findOne({ email: input.email });
      if (existing) {
        return { content: [text("Employee with this email already exists.")] };
      }

      const created = await EmployeeModel.create(input);

      return {
        content: [text(`Employee added successfully.\nID: ${created._id}`)],
      };
    } catch (error: any) {
      return { content: [text(`Failed to add employee: ${error.message}`)] };
    }
  }
);

server.registerTool(
  "listemployees",
  {
    title: "List Employees",
    description: "Fetch all employees or search by name/email.",
    inputSchema: schema(listEmployeeSchema),
  },
  async (input: ListEmployeeInput) => {
    await conectDB();
    try {
      const filter: any = {};

      if (input.name) filter.name = { $regex: input.name, $options: "i" };
      if (input.email) filter.email = { $regex: input.email, $options: "i" };
      if (input.skill) filter.skill = input.skill;

      const employees =
        Object.keys(filter).length > 0
          ? await EmployeeModel.find(filter)
          : await EmployeeModel.find();

      return { content: [text(JSON.stringify(employees, null, 2))] };
    } catch (error: any) {
      return { content: [text(`Failed to list employees: ${error.message}`)] };
    }
  }
);

server.registerTool(
  "getemployee",
  {
    title: "Get Employee",
    description: "Fetch a single employee by ID.",
    inputSchema: schema(getEmployeeSchema),
  },
  async (input: GetEmployeeInput) => {
    await conectDB();
    try {
      const employee = await EmployeeModel.findById(input.id);

      if (!employee) return { content: [text("Employee not found.")] };

      return { content: [text(JSON.stringify(employee, null, 2))] };
    } catch (error: any) {
      return { content: [text(`Failed to fetch employee: ${error.message}`)] };
    }
  }
);

server.registerTool(
  "updateemployee",
  {
    title: "Update Employee",
    description: "Update an existing employee.",
    inputSchema: schema(updateEmployeeSchema),
  },
  async (input: UpdateEmployeeInput) => {
    await conectDB();
    try {
      const { id, ...updateData } = input;

      const updated = await EmployeeModel.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!updated) return { content: [text("Employee not found.")] };

      return {
        content: [
          text(`Employee updated.\n${JSON.stringify(updated, null, 2)}`),
        ],
      };
    } catch (error: any) {
      return { content: [text(`Failed to update: ${error.message}`)] };
    }
  }
);

server.registerTool(
  "deleteemployee",
  {
    title: "Delete Employee",
    description: "Delete an employee by ID.",
    inputSchema: schema(getEmployeeSchema),
  },
  async (input: GetEmployeeInput) => {
    await conectDB();
    try {
      const deleted = await EmployeeModel.findByIdAndDelete(input.id);

      if (!deleted) return { content: [text("Employee not found.")] };

      return { content: [text("Employee deleted successfully.")] };
    } catch (error: any) {
      return { content: [text(`Failed to delete employee: ${error.message}`)] };
    }
  }
);
