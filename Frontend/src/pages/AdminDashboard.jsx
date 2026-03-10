import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function AdminDashboard() {
  const location = useLocation();
  const [adminEmail, setAdminEmail] = useState("");
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDomain, setNewProjectDomain] = useState("");
  const [newManagerEmail, setNewManagerEmail] = useState("");
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    if (!location.state?.adminEmail) {
      toast.error("Admin email missing. Please login again.");
    } else {
      setAdminEmail(location.state.adminEmail);
      fetchCompanies(location.state.adminEmail);
    }
  }, [location.state]);

  const fetchCompanies = async (email) => {
    try {
      const res = await axios.get("http://localhost:6087/api/admin/get-companies");
      if (res.data.status) {
        const filtered = res.data.companies.filter(c => c.adminEmail === email);
        setCompanies(filtered);

        // Optionally fetch projects for all companies on load
        filtered.forEach(c => fetchProjects(c.companyEmail));
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch companies");
    }
  };

  const fetchProjects = async (companyEmail) => {
    try {
      const res = await axios.get("http://localhost:6087/api/admin/get-projects");
      if (res.data.status) {
        setProjects(res.data.projects.filter(p => p.companyEmail === companyEmail));
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch projects");
    }
  };

  const fetchManagers = async (projectId) => {
    try {
      const res = await axios.get("http://localhost:6087/api/get-managers");
      if (res.data.status) {
        setManagers(res.data.managers.filter(m => m.projectId._id === projectId));
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch managers");
    }
  };

  const createProject = async (companyEmail) => {
    if (!newProjectName || !newProjectDomain || !companyEmail || !adminEmail) {
      return toast.error("All project fields are required!");
    }
    try {
      const res = await axios.post("http://localhost:6087/api/admin/add-project", {
        projectName: newProjectName,
        companyEmail,
        domain: newProjectDomain,
        createdBy: adminEmail // email string
      });
      if (res.data.status) {
        toast.success(`Project created! ID: ${res.data.projectId}`);
        setNewProjectName("");
        setNewProjectDomain("");
        fetchProjects(companyEmail);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log("Frontend Create Project Error:", err.response?.data || err);
      toast.error("Failed to create project");
    }
  };

  const addManager = async (projectId) => {
    if (!newManagerEmail || !projectId) {
      return toast.error("Manager email and project selection are required!");
    }
    try {
      const res = await axios.post("http://localhost:6087/api/admin/admin-add-manager", {
        email: newManagerEmail,
        projectId
      });
      if (res.data.status) {
        toast.success(`Manager added! Token: ${res.data.registrationToken}`);
        setNewManagerEmail("");
        fetchManagers(projectId);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to add manager");
    }
  };

  return (
    <div className="dashboardContainer">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Sidebar */}
      <div className="sidebar">
        <h2>Admin Dashboard</h2>
        <button onClick={() => setActiveSection("overview")}>Project Overview</button>
        <button onClick={() => setActiveSection("addProject")}>Add Project</button>
        <button onClick={() => setActiveSection("manageManagers")}>Manage Managers</button>
      </div>

      {/* Main Content */}
      <div className="mainContent">
        {activeSection === "overview" && (
          <div>
            <h2>Project Overview</h2>
            {projects.length === 0 && <p className="noData">No projects created yet</p>}
            {projects.map(p => (
              <div key={p._id} className="projectCard">
                <p><strong>Name:</strong> {p.projectName}</p>
                <p><strong>ID:</strong> {p.projectId}</p>
                <p><strong>Domain:</strong> {p.domain}</p>
                <p><strong>Created By:</strong> {p.createdBy?.AdminName || p.createdBy?.Adminemail}</p>
              </div>
            ))}
          </div>
        )}

        {activeSection === "addProject" && (
          <div>
            <h2>Add Project</h2>
            {companies.length === 0 && <p className="noData">No companies to assign project</p>}
            {companies.map(c => (
              <div key={c._id} className="companyCard">
                <h3>{c.companyName}</h3>
                <input
                  type="text"
                  placeholder="Project Name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Project Domain"
                  value={newProjectDomain}
                  onChange={(e) => setNewProjectDomain(e.target.value)}
                />
                <button onClick={() => createProject(c.companyEmail)}>Create Project</button>
              </div>
            ))}
          </div>
        )}

        {activeSection === "manageManagers" && (
          <div>
            <h2>Manage Project Managers</h2>
            {projects.length === 0 && <p className="noData">No projects created yet</p>}
            {projects.map(p => (
              <div key={p._id} className="projectCard">
                <p><strong>Project:</strong> {p.projectName}</p>
                <p><strong>ID:</strong> {p.projectId}</p>
                <button onClick={() => { setSelectedProject(p._id); fetchManagers(p._id); }}>Select Project</button>
              </div>
            ))}

            {selectedProject && (
              <div className="managerSection">
                <h3>Managers for selected project</h3>
                <input
                  type="email"
                  placeholder="Manager Email"
                  value={newManagerEmail}
                  onChange={(e) => setNewManagerEmail(e.target.value)}
                />
                <button onClick={() => addManager(selectedProject)}>Add Manager</button>

                {managers.length === 0 && <p className="noData">No managers assigned yet</p>}
                {managers.map(m => (
                  <div key={m._id} className="managerCard">
                    <p><strong>Email:</strong> {m.email}</p>
                    <p><strong>Project ID:</strong> {m.projectId._id}</p>
                    <p><strong>Registration Token:</strong> {m.registrationToken}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .dashboardContainer { display:flex; min-height:100vh; font-family:Arial,sans-serif; }
        .sidebar { width:220px; background:#1e3c72; color:#fff; padding:20px; display:flex; flex-direction:column; }
        .sidebar h2 { text-align:center; margin-bottom:20px; }
        .sidebar button { margin:5px 0; padding:10px; border:none; border-radius:10px; cursor:pointer; background:linear-gradient(135deg,#4facfe,#b721ff); color:#fff; font-weight:bold; transition:0.2s; }
        .sidebar button:hover { opacity:0.9; transform:scale(1.02); }
        .mainContent { flex:1; padding:20px; background:linear-gradient(135deg,#2a5298,#1e3c72); color:#fff; }
        .companyCard, .projectCard, .managerCard { background:rgba(255,255,255,0.1); padding:15px; border-radius:12px; margin-bottom:15px; box-shadow:0 5px 15px rgba(0,0,0,0.3); }
        .companyCard input, .managerCard input { width:100%; padding:8px; margin:8px 0; border-radius:8px; border:none; outline:none; }
        .companyCard button, .projectCard button, .managerCard button { padding:8px 12px; border:none; border-radius:8px; cursor:pointer; background:linear-gradient(135deg,#4facfe,#b721ff); color:white; font-weight:bold; margin-top:5px; }
        .noData { font-style:italic; color:rgba(255,255,255,0.7); margin-bottom:10px; }
      `}</style>
    </div>
  );
}