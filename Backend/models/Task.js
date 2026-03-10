import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true
  },

  projectId: {
    type: String,
    required: true
  },

  taskName: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ['pending', 'done'],
    default: 'pending'
  },

  assignedBy: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

})

export default mongoose.model('Task', taskSchema)