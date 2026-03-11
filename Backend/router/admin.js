import express, { application } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import crypto from "crypto";
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import Admin from '../models/Admin.js';
import Company from '../models/Company.js'
import Project from '../models/Project.js'
import Manager from '../models/Manager.js'

const router = express.Router()
const SALT_ROUNDS = 10


router.post('/admin-register',async (req,res)=>{
  try{
    const { AdminName,Adminemail,password}=req.body
    const existingAdmin=await Admin.findOne({
      Adminemail:Adminemail
    })
    if(existingAdmin)
    {
      return res.json({status:false,message:'admin exists!!'})   
    }
    else 
    {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);    

      const admin=new Admin({
        AdminName,
        Adminemail,
        password: hashedPassword 
      })
  
      await admin.save();
      res.json({status:true,message:'admin registered successfully!'})
    }
  }
  catch(err){
    console.log(err)
    res.status(500).json({status:false,message:'Internal Error'})
  }
})
  

router.post('/admin-login',async(req,res)=>{
  try{
    const {Adminemail,password}=req.body

    const existingAdmin=await Admin.findOne({ Adminemail: Adminemail })

    if(existingAdmin)
    {  
      const match = await bcrypt.compare(password, existingAdmin.password);

      if (match) {
        res.json({ status: true, message: 'Login Successful!!!' });
      } 
      else {
        res.json({ status: false, message: 'Invalid password' });
      }
    } 
    else{
      res.json({status:false,message:'admin does not exist'})
    }
  }
  catch(error){
    console.log(error)
    res.json({status:false,message:'Internal error'})
  }
})


router.post('/add-company', async (req, res) => {
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
 

router.get('/get-companies',async(req,res)=>{
  try{
    const companies=await Company.find()   
    res.send({status:true,companies})
  } 
  catch(err){
    console.log(err)
    res.status(500).json({status:false,message:'Internal Error'})
  } 
}) 

function generateRandomString(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return [...Array(length)]
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join('');
}

router.post("/add-project", async (req, res) => {
  try {
    const { projectName, companyEmail, domain, createdBy } = req.body;

    if (!projectName || !companyEmail || !domain || !createdBy) {
      return res.status(400).json({ status: false, message: "All fields are required" });
    }

  
    const admin = await Admin.findOne({ Adminemail: createdBy });
    if (!admin) return res.status(400).json({ status: false, message: "Admin not found" });


    let projectId = generateRandomString(8);
    while (await Project.findOne({ projectId })) {
      projectId = generateRandomString(8);
    }

    const project = new Project({
      projectName,
      companyEmail,
      domain,
      createdBy: admin._id,
      projectId
    });

    await project.save();

    res.json({
      status: true,
      message: "Project created successfully!",
      projectId
    });

  } catch (err) {
    console.error("Add Project Error:", err);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
});
router.get("/get-projects", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "AdminName Adminemail");
    res.json({ status: true, projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
});

router.post('/admin-add-manager', async (req, res) => {
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

router.get('/get-managers/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { token } = req.query;

    const filter = { projectId: new mongoose.Types.ObjectId(projectId) }; // <-- fixed
    if (token) {
      filter.registrationToken = token;
    }

    const manager = await Manager.findOne(filter).populate('projectId', 'projectName');

    res.json({ status: true, manager: manager || null });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
})
export default router