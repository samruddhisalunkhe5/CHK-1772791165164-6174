import express, { application } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import adminRoutes from './router/admin.js'
import managerRoutes from './router/manager.js'
import teamMemberRoutes from './router/teammember.js' 

const SALT_ROUNDS = 10;
const URL = 'mongodb://localhost:27017/projectdb'

  mongoose.connect(URL)
    .then(() => console.log('Mongodb Database connected!!'))
    .catch((err) => console.log('Database not connected', err))

  const server=express()
  server.use(bodyParser.json())
  server.use(cors())

server.use('/api/admin',adminRoutes)
server.use('/api/manager', managerRoutes)
server.use('/api/member', teamMemberRoutes)

  server.listen(6087,'0.0.0.0',
      ()=>
      {
      console.log("Server is in listening mode!!!")
      console.log("Server is listening on 0.0.0.0:6087")
       console.log("MongoDB connected")
      }
      
  )
