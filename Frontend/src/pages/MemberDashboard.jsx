import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function AdminDashboard() {
  const location = useLocation();
  const [adminEmail, setAdminEmail] = useState("");
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [managers, setManagers] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDomain, setNewProjectDomain] = useState("");
  const [newManagerEmail, setNewManagerEmail] = useState("");
  const [loadingManager, setLoadingManager] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    if (!location.state?.adminEmail) {
      toast.error("Admin email missing. Please login again.");
    } else {
      setAdminEmail(location.state.adminEmail);
      fetchCompanies(location.state.adminEmail);
    }
  }, [location.state]);

  // Fetch companies for this admin
  const fetchCompanies = async (email) => {
    try {
      const res = await axios.get("http://localhost:6087/api/admin/get-companies");
      if (res.data.status) {
        const filtered = res.data.companies.filter(c => c.adminEmail === email);
        setCompanies(filtered);
        filtered.forEach(c => fetchProjects(c.companyEmail));
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch companies");
    }
  };

  // Fetch projects
  const fetchProjects = async (companyEmail) => {
    try {
      const res = await axios.get("http://localhost:6087/api/admin/get-projects");
      if (res.data.status) {
        setProjects(prev => [
          ...prev.filter(p => p.companyEmail !== companyEmail),
          ...res.data.projects.filter(p => p.companyEmail === companyEmail)
        ]);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch projects");
    }
  };

  // Create a project ✅ Corrected
  const createProject = async (companyEmail) => {
    if (!newProjectName || !newProjectDomain) return toast.error("Project Name and Domain required");
    try {
      const res = await axios.post("http://localhost:6087/api/admin/admin-add-project", {
        companyEmail, 
        projectName: newProjectName, 
        domain: newProjectDomain, 
        createdBy: adminEmail // Only email required by backend usually
      });
      if (res.data.status) {
        toast.success("Project created successfully!");
        setNewProjectName("");
        setNewProjectDomain("");
        fetchProjects(companyEmail); // Refresh projects
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      const message = err?.response?.data?.message || "Failed to create project";
      toast.error(message);
    }
  };

  // Fetch manager
  const fetchManager = async (projectId) => {
    setLoadingManager(true);
    try {
      const res = await axios.get(`http://localhost:6087/api/admin/get-managers/${projectId}`);
      setManagers(prev => ({ ...prev, [projectId]: res.data.manager || null }));
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch manager");
      setManagers(prev => ({ ...prev, [projectId]: null }));
    } finally {
      setLoadingManager(false);
    }
  };

  const addManager = async () => {
    if (!newManagerEmail || !selectedProject) return toast.error("Manager email and project required");
    try {
      const res = await axios.post("http://localhost:6087/api/admin/admin-add-manager", {
        email: newManagerEmail,
        projectId: selectedProject
      });
      if (res.data.status) {
        toast.success(`Manager added! Token: ${res.data.registrationToken}`);
        setNewManagerEmail("");
        fetchManager(selectedProject);
      } else toast.error(res.data.message);
    } catch (err) {
      console.log(err);
      toast.error("Failed to add manager");
    }
  };

  const copyToken = (token) => {
    navigator.clipboard.writeText(token);
    toast.success("Token copied!");
  };

  return (
    <div className="dashboardContainer">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="sidebar">
        <h2>Admin Dashboard</h2>
        <button onClick={() => setActiveSection("overview")}>Project Overview</button>
        <button onClick={() => setActiveSection("addProject")}>Add Project</button>
        <button onClick={() => setActiveSection("manageManagers")}>Manage Managers</button>
      </div>

      <div className="mainContent">
        {activeSection === "overview" && (
          <div>
            <h2>Project Overview</h2>
            {projects.length === 0 && <p className="noData">No projects created yet</p>}
            {projects.map(p => (
              <div key={p._id} className="projectCard">
                <p><strong>Name:</strong> {p.projectName}</p>
                <p><strong>ID:</strong> {p._id}</p>
                <p><strong>Domain:</strong> {p.domain}</p>
              </div>
            ))}
          </div>
        )}

        {activeSection === "addProject" && (
          <div>
            <h2>Add Project</h2>
            {companies.length === 0 && <p className="noData">No companies available</p>}
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
            {projects.map(p => (
              <div key={p._id} className="projectCard">
                <p><strong>Project:</strong> {p.projectName}</p>
                <p><strong>ID:</strong> {p._id}</p>
                <button onClick={() => { setSelectedProject(p._id); fetchManager(p._id); }}>
                  Select Project
                </button>
              </div>
            ))}

            {selectedProject && (
              <div className="managerSection">
                <input
                  type="email"
                  placeholder="Manager Email"
                  value={newManagerEmail}
                  onChange={(e) => setNewManagerEmail(e.target.value)}
                />
                <button onClick={addManager}>Add Manager</button>

                {loadingManager ? (
                  <p>Loading...</p>
                ) : !managers[selectedProject] ? (
                  <p className="noData">No manager assigned</p>
                ) : (
                  <div className="managerCard">
                    <p><strong>Email:</strong> {managers[selectedProject].email}</p>
                    <p><strong>Token:</strong> {managers[selectedProject].registrationToken} 
                      <button onClick={() => copyToken(managers[selectedProject].registrationToken)}>Copy</button>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .dashboardContainer { display:flex; min-height:100vh; font-family:Arial,sans-serif; }
        .sidebar { width:220px; background:#1e3c72; color:#fff; padding:20px; display:flex; flex-direction:column; }
        .sidebar h2 { text-align:center; margin-bottom:20px; }
        .sidebar button { margin:5px 0; padding:10px; border:none; border-radius:10px; cursor:pointer; background:linear-gradient(135deg,#4facfe,#b721ff); color:#fff; font-weight:bold; }
        .sidebar button:hover { opacity:0.9; }
        .mainContent { flex:1; padding:20px; background:linear-gradient(135deg,#2a5298,#1e3c72); color:#fff; }
        .companyCard, .projectCard, .managerCard { background:rgba(255,255,255,0.1); padding:15px; border-radius:12px; margin-bottom:15px; }
        .companyCard input { width:100%; padding:8px; margin:8px 0; border-radius:8px; border:none; }
        .companyCard button { width:100%; padding:8px; border:none; border-radius:8px; cursor:pointer; background:linear-gradient(135deg,#4facfe,#b721ff); color:white; }
      `}</style>
    </div>
  );
}