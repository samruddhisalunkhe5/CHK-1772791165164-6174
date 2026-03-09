const express=require('express')
const bodyParser=require('body-parser')
const cors=require('cors')
const mongoose=require('mongoose')
const bcrypt = require('bcrypt')

const SALT_ROUNDS = 10;
const URL = 'mongodb://localhost:27017/projectdb'

const Users=require("./models/Users")
const Admin=require("./models/Admin")
mongoose.connect(URL)
  .then(() => console.log('Mongodb Database connected!!'))
  .catch((err) => console.log('Database not connected', err));

const server=express()
server.use(bodyParser.json())
server.use(cors())



server.post('/admin-register',async (req,res)=>{
try{
const { AdminName,Adminemail,password}=req.body
const existingAdmin=await Admin.findOne({
    Adminemail:Adminemail
})
if(existingAdmin)
{
 res.json({status:false,message:'admin exists!!'})   
}
else 
{
const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);    
const admin=new Admin({
 AdminName,Adminemail,password: hashedPassword 
})
 
await admin.save();
res.json({status:true,message:'admin registered successfully!'})
}
}
catch(err){
console.log("Internal Error")
}
})



server.post('/admin-login',async(req,res)=>{
    try{
const {Adminemail,password}=req.body
const existingAdmin=await Admin.findOne({ Adminemail: Adminemail })
if(existingAdmin)
{  const match = await bcrypt.compare(password, existingAdmin.password);

    if (match) {
      res.json({ status: true, message: 'Login Successful!!!' });
    } else {
      res.json({ status: false, message: 'Invalid password' });
    }
} 
else{
 res.json({status:false,message:'admin does not exist'})
}
}
catch(error){
 res.json({status:false,message:'Internal error'})
}
})

server.post('/register-manager',async (req,res)=>{
try{
const {fullName,email,mobileNo,password,role,token}=req.body
const existingUser=await Manager.findOne({
    email:email
})
if(existingUser)
{
 res.json({status:false,message:'user exists!!'})   
}
else 
{
const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
const user=new Manager({
 fullName,email,mobileNo,password: hashedPassword,role,token  
})
await user.save();
res.json({status:true,message:'Manager registered successfully!'})
}
}
catch(err){
console.log("Internal Error")
}
})

server.post('/register',async (req,res)=>{
try{
const {fullName,email,mobileNo,password,role,token}=req.body
const existingUser=await Users.findOne({
    email:email
})
if(existingUser)
{
 res.json({status:false,message:'user exists!!'})   
}
else 
{
const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
const user=new Users({
 fullName,email,mobileNo,password: hashedPassword,role,token  
})
await user.save();
res.json({status:true,message:'user registered successfully!'})
}
}
catch(err){
console.log("Internal Error")
}
})

server.post('/login' , async (req,res)=>{
    try{
const {email,password}=req.body
const existingUser =await Users.findOne({ email: email })
if(existingUser)
{  const match = await bcrypt.compare(password, existingUser.password);

    if (match) {
      res.json({ status: true, message: 'Login Successful!!!' });
    } else {
      res.json({ status: false, message: 'Invalid password' });
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
} 
else{
 res.json({status:false,message:'user does not exist'})
}

}
catch(error){
 res.json({status:false,message:'Internal error'})
}
})


server.listen(6087,
    ()=>
    {
    console.log("Server is in listening mode!!!")
    }
    
)