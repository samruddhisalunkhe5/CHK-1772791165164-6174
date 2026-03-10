const mongoose = require('mongoose')

const teamMemberSchema = new mongoose.Schema({
  fullName: { type: String },
  email: { type: String, required: true },
  mobileNo: { type: String },
  password: { type: String },
  projectId: { type: String, ref: 'Project', required: true },
  isRegistered: { type: Boolean, default: false }
})

module.exports = mongoose.model('TeamMember', teamMemberSchema)