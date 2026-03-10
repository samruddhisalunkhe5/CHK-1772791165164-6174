import mongoose from 'mongoose'

const teamMemberSchema = new mongoose.Schema({
  fullName: { type: String },
  email: { type: String, required: true },
  password: { type: String },
  projectId: { type: String, required: true }, 
  task: { type: String },
  mobileNo: { type: String },
  isRegistered: { type: Boolean, default: false }
}, { timestamps: true })

const TeamMember = mongoose.models.TeamMember || mongoose.model('TeamMember', teamMemberSchema)
export default TeamMember