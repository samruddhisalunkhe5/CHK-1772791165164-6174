import express, { application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
const URL = 'mongodb://localhost:27017/projectdb';

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


server.post('/add-company', async (req, res) => {
  try {
    const { companyName, companyEmail, domain, adminEmail } = req.body;
    if (!companyName || !companyEmail) {
      return res.status(400).json({ status: false, message: 'companyName and companyEmail are required' });
    }
    const existingCompany = await Company.findOne({ companyEmail });
    if (existingCompany) {
      return res.status(409).json({ status: false, message: 'Company with this email already exists!' });
    }
    const company = new Company({ companyName, companyEmail, domain, adminEmail });
    await company.save();
res.json({ status: true, message: 'Company added successfully!' });

  } catch (err) {
    console.error('Internal Error:', err)
    res.status(500).json({ status: false, message: 'Internal server error' })
  }
})
 
  server.get('/get-companies',async(req,res)=>{
  try{
  const companies=await Company.find()   
  res.send({status:true,companies})
  } catch(err){
  console.log("Internal Error")
  } }) 

  server.post('/add-project', async (req, res) => {
  try {
    const { projectName, companyEmail, domain, createdBy } = req.body
    if (!projectName || !companyEmail) {
      return res.status(400).json({ status: false, message: 'projectName and companyEmail are required' })
    }
    const project = new Project({ projectName, companyEmail, domain, createdBy })
    await project.save();
    res.json({ status: true, message: 'Project created successfully!', projectId: project.projectId })
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: 'Internal server error' })
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

  
server.get('/get-managers', async (req, res) => {
  try {
    const managers = await Manager.find().populate('projectId', 'projectName')    
    res.json({ status: true, managers })
  } catch (err) {
    console.log(err)
    res.status(500).json({ status: false, message: 'Internal Server Error' })
  }})

  server.post('/login-manager', async (req, res) => {
  try {
    const { email, password, projectId, registrationToken } = req.body;

    if (!email || !projectId || !registrationToken) {
      return res.status(400).json({ status: false, message: 'email, projectId and registrationToken are required' });
    }
    const manager = await Manager.findOne({
      email,
      projectId,          
      registrationToken,
      isRegistered: true
    })
    console.log("Manager found for login:", manager);
    if (!manager) {
      return res.status(404).json({ status: false, message: 'Manager not registered or invalid project/token' });
    }
    const match = await bcrypt.compare(password, manager.password);
    if (!match) {
      return res.status(401).json({ status: false, message: 'Invalid password' })
    }

    res.json({ status: true, message: 'Login Successful!' })

  } catch (err) {
    console.error(err)
    res.status(500).json({ status: false, message: 'Internal Server Error' })
  }
})

server.post('/manager-add-member', async (req, res) => {
  try {
    const { memberEmail, projectId, fullName, task } = req.body
    if (!memberEmail || !projectId) {
      return res.status(400).json({ status: false, message: 'memberEmail and projectId required' })
    }
    const project = await Project.findOne({ projectId });
    if (!project) return res.status(404).json({ status: false, message: 'Project not found' })
    const existingMember = await TeamMember.findOne({ email: memberEmail, projectId })
    if (existingMember) return res.status(409).json({ status: false, message: 'Team member slot already exists' })
    const member = new TeamMember({
      email: memberEmail,
      fullName,
      projectId,
      task,
      isRegistered: false
    })
    await member.save()
    res.json({ status: true, message: 'Team member slot created successfully!' });
  } catch (err) {
    console.error(err)
    res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
})

  server.listen(6087,'0.0.0.0',
      ()=>
      {
      console.log("Server is in listening mode!!!")
      console.log("Server is listening on 0.0.0.0:6087")
       console.log("MongoDB connected")
      }
      
  )