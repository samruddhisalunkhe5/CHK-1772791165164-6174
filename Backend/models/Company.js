const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  companyEmail: { type: String, required: true },
  domain: { type: String },
  createdBy: { type: String },
  projectToken: { type: String, required: true, unique: true } 
})

projectSchema.pre('save', function(next) {
  if (!this.projectToken) {
    this.projectToken = Math.random().toString(36).substring(2, 10).toUpperCase()
  }
  next()
})

module.exports = mongoose.model("Project", projectSchema)