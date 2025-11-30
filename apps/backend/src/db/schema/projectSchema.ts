import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employeeModel",
    },

    duedate: {
      type: Date,
      trim: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },

    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed", "On Hold"],
      default: "Not Started",
    },

    startedAt: {
      type: Date,
      default: null,
    },

    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("projectModel", projectSchema);
