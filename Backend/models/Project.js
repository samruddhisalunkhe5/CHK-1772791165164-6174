import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  companyEmail: { type: String, required: true },
  domain: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  projectId: { type: String, required: true, unique: true } // alphanumeric ID
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);