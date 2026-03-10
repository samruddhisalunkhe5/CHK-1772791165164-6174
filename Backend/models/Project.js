import mongoose from 'mongoose'
import crypto from 'crypto'

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  companyEmail: { type: String, required: true },
  domain: { type: String },
  createdBy: { type: String },
  projectId: { 
    type: String, 
    required: true, 
    unique: true, 
    default: () => crypto.randomBytes(4).toString('hex').toUpperCase() 
  }
}, { timestamps: true })

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export default Project;