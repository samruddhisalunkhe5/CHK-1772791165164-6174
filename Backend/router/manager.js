import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors' 
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import TeamMember from '../models/TeamMember.js'
import Manager from '../models/Manager.js'
import Project from '../models/Project.js'
import Task from '../models/Task.js'

const router = express.Router()
const SALT_ROUNDS = 10; 

router.post('/register-manager', async (req, res) => {
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
 

  router.post('/login-manager', async (req, res) => {
  try {
    const { email, password, projectId, registrationToken } = req.body
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

router.post('/manager-add-member', async (req, res) => {
  try {

    const { memberEmail, projectId, fullName, task } = req.body

    if (!memberEmail || !projectId) {
      return res.status(400).json({
        status: false,
        message: 'memberEmail and projectId required'
      })
    }

    const project = await Project.findOne({ projectId })

    if (!project) {
      return res.status(404).json({
        status: false,
        message: 'Project not found'
      })
    }
    let member = await TeamMember.findOne({
      email: memberEmail,
      projectId
    })

    if (!member) {

      member = new TeamMember({
        email: memberEmail,
        projectId,
        fullName,
        isRegistered: false
      })

      await member.save()
    }
    if (task) {
      const newTask = new Task({
        email: memberEmail,
        projectId,
        taskName: task,
        status: 'pending'
      })
      await newTask.save()
    }

    res.json({
      status: true,
      message: 'Member slot checked and task assigned'
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({
      status: false,
      message: 'Internal Server Error'
    })
  }
})

export default router