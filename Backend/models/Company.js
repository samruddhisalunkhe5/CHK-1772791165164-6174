import mongoose from 'mongoose'

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  companyEmail: { type: String, required: true },
  domain: { type: String, required: true },
  adminEmail: { type: String, required: true }
})

const Company = mongoose.model('Company', companySchema)
export default Company