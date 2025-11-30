import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    skill: {
      type: String,
      enum: {
        values: [
          "Frontend",
          "Backend",
          "FullStack",
          "Marketing",
          "Project Manager",
          "Sales",
        ],
      },
      required: true,
    },

    experience: {
      type: String,
      enum: {
        values: ["Intern", "Associate", "Senior"],
      },
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("employeeModel", employeeSchema);
