import TeamMember from '../models/TeamMember.js'
import Project from '../models/Project.js'
import express from 'express'
import bcrypt from 'bcrypt'
import Task from '../models/Task.js'

const router = express.Router()
const SALT_ROUNDS = 10;

router.post('/member-signup', async (req, res) => {
  try {
    const { fullName, email, password, mobileNo, projectId } = req.body
    if (!email || !password || !projectId) {
      return res.status(400).json({ status: false, message: 'Email, password, and projectId are required' })
    }
    const existingMember = await TeamMember.findOne({ email, projectId, isRegistered: false })
    if (!existingMember) {
      return res.status(403).json({ status: false, message: 'No registration slot assigned. Contact your manager.' })
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    existingMember.fullName = fullName
    existingMember.password = hashedPassword
    existingMember.mobileNo = mobileNo
    existingMember.isRegistered = true
    await existingMember.save()
    res.json({ status: true, message: 'Team member registered successfully!' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ status: false, message: 'Internal Server Error' })
  }
})

router.post('/member-login', async (req, res) => {
  try {
    const { email, password, projectId } = req.body
    if (!email || !password || !projectId) {
      return res.status(400).json({ status: false, message: 'Email, password, and projectId required' })
    }

    const member = await TeamMember.findOne({ email, projectId, isRegistered: true })
    if (!member) return res.status(404).json({ status: false, message: 'Member not found or not registered' })

    const match = await bcrypt.compare(password, member.password)
    if (!match) return res.status(401).json({ status: false, message: 'Invalid password' })

    res.json({ status: true, message: 'Login successful!', memberId: member._id, projectId: member.projectId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ status: false, message: 'Internal Server Error' })
  }
})


 router.get('/member-tasks', async (req, res) => {
  try {

    const { email, projectId } = req.query

    if (!email || !projectId) {
      return res.status(400).json({
        status: false,
        message: 'Email and projectId required'
      })
    }

    const tasks = await Task.find({ email, projectId })

    res.json({
      status: true,
      tasks
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({
      status: false,
      message: 'Internal Server Error'
    })
  }
})

router.put('/update-task-status', async (req, res) => {
  try {

    const { projectId, status } = req.body

    if (!projectId || !status) {
      return res.status(400).json({
        status: false,
        message: 'projectId and status required'
      })
    }

    const task = await Task.findByIdAndUpdate(
      projectId,
      { status },
      { new: true }
    )

    if (!task) {
      return res.status(404).json({
        status: false,
        message: 'Task not found'
      })
    }

    res.json({
      status: true,
      message:
       'Task updated successfully',
      task
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