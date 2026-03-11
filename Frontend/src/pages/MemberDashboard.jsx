import React, { useEffect, useState } from "react"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import { useLocation } from "react-router-dom"
import { Gantt } from "react-gantt-task"  // or you can use Recharts for custom Gantt

export default function MemberDashboard() {
  const location = useLocation()
  const { memberId, projectId } = location.state || {}
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [fileUploads, setFileUploads] = useState({})  // to store uploaded files

  const token = localStorage.getItem("token")  // JWT token from login

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:6087/api/member/member-tasks", {
        params: { email: memberId, projectId },
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data.status) {
        setTasks(res.data.tasks)
      } else {
        toast.error(res.data.message)
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to fetch tasks")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // Update task status (Yes/No)
  const handleStatusChange = async (taskId, status) => {
    try {
      const res = await axios.put("http://localhost:6087/api/member/update-task-status", {
        taskId,
        status
      }, { headers: { Authorization: `Bearer ${token}` } })

      if (res.data.status) {
        toast.success("Task updated")
        fetchTasks()
      } else {
        toast.error(res.data.message)
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to update task")
    }
  }

  // Handle file upload
  const handleFileUpload = (e, taskId) => {
    const file = e.target.files[0]
    setFileUploads({ ...fileUploads, [taskId]: file })
  }

  const submitFile = async (taskId) => {
    const file = fileUploads[taskId]
    if (!file) return toast.error("Select a file first")
    const formData = new FormData()
    formData.append("file", file)
    formData.append("taskId", taskId)

    try {
      const res = await axios.post("http://localhost:6087/api/member/upload-task-file", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      })
      if (res.data.status) {
        toast.success("File uploaded successfully")
      } else {
        toast.error(res.data.message)
      }
    } catch (err) {
      console.error(err)
      toast.error("File upload failed")
    }
  }

  // Prepare Gantt chart tasks
  const ganttTasks = tasks.map(task => ({
    start: new Date(task.startDate),
    end: new Date(task.endDate),
    name: task.name,
    id: task._id,
    progress: task.status === "Yes" ? 100 : 0
  }))

  return (
    <div className="dashboard">
      <Toaster position="top-center" />
      <h1>Team Member Dashboard</h1>
      {loading ? <p>Loading tasks...</p> : (
        <>
          <div className="tasks">
            {tasks.map(task => (
              <div key={task._id} className="task-card">
                <h3>{task.name}</h3>
                <p>Status: {task.status || "No"}</p>
                <button onClick={() => handleStatusChange(task._id, "Yes")}>Yes</button>
                <button onClick={() => handleStatusChange(task._id, "No")}>No</button>
                <div>
                  <input type="file" onChange={(e) => handleFileUpload(e, task._id)} />
                  <button onClick={() => submitFile(task._id)}>Upload File</button>
                </div>
              </div>
            ))}
          </div>

          <div className="gantt-chart">
            <h2>Project Progress</h2>
            <Gantt tasks={ganttTasks} />
          </div>
        </>
      )}

      <style>{`
        .dashboard {
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .tasks {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 40px;
        }
        .task-card {
          border: 1px solid #ccc;
          padding: 15px;
          border-radius: 10px;
          width: 250px;
        }
        .task-card h3 {
          margin-bottom: 10px;
        }
        .task-card button {
          margin-right: 5px;
          margin-bottom: 5px;
          padding: 5px 10px;
          border: none;
          background-color: #4facfe;
          color: white;
          border-radius: 5px;
          cursor: pointer;
        }
        .task-card input {
          margin-top: 5px;
        }
        .gantt-chart {
          margin-top: 30px;
        }
      `}</style>
    </div>
  )
}