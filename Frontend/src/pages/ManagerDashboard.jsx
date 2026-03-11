import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function ManagerDashboard({ location }) {
  const { state } = location || {};
  const projectId = state?.projectId || ""; // Must be passed from login
  const projectTitle = state?.projectTitle || "Project Title";

  const [activeTab, setActiveTab] = useState("overview");

  const [form, setForm] = useState({
    memberEmail: "",
    fullName: "",
    task: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async () => {
    const { memberEmail, fullName, task } = form;

    if (!memberEmail || !projectId) {
      return toast.error("Member email and project ID are required");
    }

    if (activeTab === "addMember" && !fullName) {
      return toast.error("Full Name is required for adding a member");
    }

    if (activeTab === "assignTasks" && !task) {
      return toast.error("Task is required to assign");
    }

    try {
     
      const payload = { memberEmail, projectId };
      if (fullName) payload.fullName = fullName;
      if (task) payload.task = task;

      const res = await axios.post(
        "http://localhost:6087/api/manager/manager-add-member",
        payload
      );

      if (res.data.status) {
        toast.success(res.data.message);
        setForm({ memberEmail: "", fullName: "", task: "" });
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Error submitting form");
    }
  };

  return (
    <div className="dashboardContainer">
      <Toaster position="top-center" />
      <h1 className="projectTitle">{projectTitle}</h1>

  
      <div className="tabs">
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Project Overview
        </button>
        <button
          className={activeTab === "addMember" ? "active" : ""}
          onClick={() => setActiveTab("addMember")}
        >
          Add Member
        </button>
        <button
          className={activeTab === "assignTasks" ? "active" : ""}
          onClick={() => setActiveTab("assignTasks")}
        >
          Assign Tasks
        </button>
      </div>

    
      <div className="tabContent">
        {activeTab === "overview" && (
          <div>
            <h2>Project Overview</h2>
            <p>
              Display project details, members, tasks, and deadlines here.
            </p>
          </div>
        )}

        {(activeTab === "addMember" || activeTab === "assignTasks") && (
          <div>
            <h2>
              {activeTab === "addMember"
                ? "Add Member"
                : "Assign Task to Member"}
            </h2>
            <div className="formGroup">
              <input
                type="email"
                name="memberEmail"
                placeholder="Member Email"
                value={form.memberEmail}
                onChange={handleChange}
              />
              {activeTab === "addMember" && (
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={handleChange}
                />
              )}
              {activeTab === "assignTasks" && (
                <input
                  type="text"
                  name="task"
                  placeholder="Task Name"
                  value={form.task}
                  onChange={handleChange}
                />
              )}
              <button onClick={handleSubmit}>
                {activeTab === "addMember" ? "Add Member" : "Assign Task"}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .dashboardContainer {
          min-height: 100vh;
          padding: 40px 20px;
          background: linear-gradient(135deg, #1e3c72, #6a11cb);
          font-family: Arial, sans-serif;
          color: white;
        }

        .projectTitle {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 30px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }

        .tabs {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .tabs button {
          padding: 10px 20px;
          border-radius: 10px;
          border: none;
          font-weight: bold;
          cursor: pointer;
          background: linear-gradient(135deg, #4facfe, #b721ff);
          color: white;
          transition: 0.3s;
        }

        .tabs button.active {
          box-shadow: 0 0 15px rgba(255,255,255,0.4);
        }

        .tabs button:hover {
          transform: scale(1.05);
        }

        .tabContent {
          max-width: 800px;
          margin: 0 auto;
          background: rgba(255,255,255,0.05);
          padding: 30px;
          border-radius: 15px;
          backdrop-filter: blur(15px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }

        .tabContent h2 {
          margin-bottom: 15px;
        }

        .formGroup {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .formGroup input {
          padding: 12px;
          border-radius: 10px;
          border: none;
          outline: none;
          font-size: 16px;
          background: rgba(255,255,255,0.1);
          color: white;
          backdrop-filter: blur(10px);
        }

        .formGroup input::placeholder {
          color: rgba(255,255,255,0.7);
        }

        .formGroup button {
          padding: 12px;
          border-radius: 10px;
          border: none;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          background: linear-gradient(135deg, #4facfe, #b721ff);
          color: white;
          transition: 0.3s;
        }

        .formGroup button:hover {
          opacity: 0.9;
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}