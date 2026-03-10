const mongoose = require('mongoose')

const teamMemberSchema = new mongoose.Schema({
  fullName: { type: String },
  email: { type: String, required: true },
  mobileNo: { type: String },
  password: { type: String },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  task: { type: String },
  registrationToken: { type: String }, 
  isRegistered: { type: Boolean, default: false }
})

module.exports = mongoose.model('TeamMember', teamMemberSchema);