const mongoose = require('mongoose')

const managerSchema = new mongoose.Schema({
  fullName: { type: String },                
  email: { type: String, required: true, unique: true },
  mobileNo: { type: String },                 
  password: { type: String },
  role: { type: String, default: 'manager' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  registrationToken: { type: String, required: true },
  isRegistered: { type: Boolean, default: false }
})

module.exports = mongoose.model('Manager', managerSchema)