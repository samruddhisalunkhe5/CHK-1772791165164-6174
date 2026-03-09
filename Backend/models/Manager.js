const mongoose=require('mongoose')

const managerSchema=new mongoose.Schema(
    {
     fullName:{type:String,required:true},
     email:{type:String,required:true,unique:true},
      mobileNo:{type:String,required:true},
      password:{type:String,required:true},
        role: { type: String, default: 'manager' },      
  token: { type: Number,required:true }
    }
)
module.exports = mongoose.model('Manager',managerSchema)
