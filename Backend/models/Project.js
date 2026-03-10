const mongoose = require('mongoose')
const crypto = require('crypto')

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  companyEmail: { type: String, required: true },
  domain: { type: String },
  createdBy: { type: String },
  projectToken: { 
    type: String, 
    required: true, 
    unique: true, 
    default: () => crypto.randomBytes(4).toString('hex').toUpperCase() 
  }
})
module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema)