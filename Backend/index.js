  import express, { application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
const URL = 'mongodb://localhost:27017/projectdb';
const app = express(); 
app.use(cors());
app.use(express.json());
import TeamMember from './models/TeamMember.js'
import Admin from './models/Admin.js'
import Manager from './models/Manager.js'
import Company from './models/Company.js'
import Project from './models/Project.js'
  mongoose.connect(URL)
    .then(() => console.log('Mongodb Database connected!!'))
    .catch((err) => console.log('Database not connected', err));

  const server=express()
  server.use(bodyParser.json())
  server.use(cors())

server.get('/', (req, res) => {
  res.send('Hello World!')
})

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

  server.post('/add-company',async(req,res)=>{
  try{
  const {companyName,companyEmail,domain,adminEmail}=req.body

  const company=new Company({ companyName,companyEmail,domain,adminEmail })
  await company.save();
  res.json({status:true,message:'company added successfully!'})
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

server.post('/register-manager', async (req, res) => {
  try {
    const { email, password, fullName, mobileNo, projectId, registrationToken } = req.body
    let projectObjectId
    try {
      projectObjectId = new mongoose.Types.ObjectId(projectId)
    } catch (err) {
      return res.json({ status: false, message: 'Invalid projectId format' })
    }
    const manager = await Manager.findOne({ 
      email, 
      projectId: projectObjectId,  
      registrationToken 
    })

    console.log("Manager found for registration:", manager)

    if (!manager) {
      return res.json({ status: false, message: 'Invalid token, email, or project ID' })
    }

    if (manager.isRegistered) {
      return res.json({ status: false, message: 'Manager already registered' })
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    manager.password = hashedPassword
    manager.fullName = fullName
    manager.mobileNo = mobileNo
    manager.isRegistered = true

    await manager.save()

    res.json({ status: true, message: 'Manager registered successfully!' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ status: false, message: 'Internal Server Error' })
  }
})

  server.post('/login-manager', async (req, res) => {
  try {
    const { email, password, projectId, registrationToken } = req.body;

  
    let projectObjectId;
    try {
      projectObjectId = new mongoose.Types.ObjectId(projectId);
    } catch (err) {
      return res.json({ status: false, message: 'Invalid projectId format' });
    }

    
    const manager = await Manager.findOne({
      email,
      projectId: projectObjectId,
      registrationToken,
      isRegistered: true
    });

    console.log("Manager found for login:", manager);

    if (!manager) {
      return res.json({ status: false, message: 'Manager not registered or invalid token/project' });
    }
    const match = await bcrypt.compare(password, manager.password);
    if (!match) {
      return res.json({ status: false, message: 'Invalid password' });
    }

    res.json({ status: true, message: 'Login Successful!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
});

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

  server.post('/admin-add-manager', async (req, res) => {
    try {
      const { email, projectId } = req.body
    
      const registrationToken = Math.random().toString(36).substring(2, 10).toUpperCase()

     const manager = new Manager({
  email,
  projectId: new mongoose.Types.ObjectId(projectId), 
  registrationToken
})

      await manager.save()

      res.json({
        status: true,
        message: 'Manager slot created',
        registrationToken 
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: false, message: 'Internal Server Error' })
    }
  })

server.post('/manager-add-member', async (req, res) => {
  try {
    const { memberEmail, projectId, projectName, task } = req.body
    let project
    if (projectId) project = await Project.findById(projectId)
    else if (projectName) project = await Project.findOne({ projectName })
    if (!project) return res.json({ status: false, message: 'Project not found' })
const existingMember = await TeamMember.findOne({ email: memberEmail, projectId: project._id })
    if (existingMember) return res.json({ status: false, message: 'Team member slot already exists' })
    const member = new TeamMember({
      email: memberEmail,
      projectId: project._id,
      task,
      isRegistered: false 
    })
    await member.save()
    res.json({
      status: true,
      message: 'Team member slot created successfully!',
      projectToken: project.projectToken
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({ status: false, message: 'Internal Server Error' })
  }
})

  server.listen(6087,'0.0.0.0',
      ()=>
      {
      console.log("Server is in listening mode!!!")
      console.log("Server is listening on 0.0.0.0:6087")
      }
      
  )