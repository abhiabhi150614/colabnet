import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedPage, setSelectedPage] = useState("availableProjects");
  const [fundingRequestProjectId, setFundingRequestProjectId] = useState(null);
  const [loginError, setLoginError] = useState("");

  // Fetch projects from the backend
  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Retrieve user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (currentUser) fetchProjects();
  }, [currentUser]);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, password }),
      });

      if (!res.ok) throw new Error("Invalid username or password");

      const user = await res.json();
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user)); // Save to localStorage
      setLoginError("");
    } catch (error) {
      setLoginError(error.message);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser"); // Remove from localStorage
    setSelectedPage("availableProjects");
  };

  // Create a new project
  const createProject = async (e) => {
    e.preventDefault();
    const newProject = {
      name: e.target.name.value,
      description: e.target.description.value,
      skills: e.target.skills.value, // Take skills as text
      leader: currentUser.name,
      members: [currentUser.name], // Initially, the user is the only member
    };

    try {
      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      const project = await res.json();
      setProjects([...projects, project]);
      setSelectedPage("myProjects");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  // Update project (members or funding)
  const updateProject = async (projectId, updates) => {
    try {
      await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      fetchProjects();
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  // Join a project
  const joinProject = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project.members.includes(currentUser.name)) {
      const updatedMembers = [...project.members, currentUser.name];
      updateProject(projectId, { ...project, members: updatedMembers });
    }
  };

  // Apply for funding
  const applyForFunding = (e, projectId) => {
    e.preventDefault();
    const fundingAmount = e.target.amount.value;
    const fundingDescription = e.target.description.value;

    updateProject(projectId, {
      fundingStatus: "Funding Applied",
      fundingAmount,
      fundingDescription,
    });
    setFundingRequestProjectId(null);
    setSelectedPage("myProjects");
  };

  // Fund a project
  const fundProject = (projectId) => {
    updateProject(projectId, { fundingStatus: "Funded" });
  };

  // Filter projects for different pages
  const availableProjects = projects.filter(
    (p) => p.leader !== currentUser?.name && !p.members.includes(currentUser?.name)
  );
  const myProjects = projects.filter(
    (p) => p.leader === currentUser?.name || p.members.includes(currentUser?.name)
  );
  const fundingAvailable = projects.filter((p) => p.fundingStatus === "Funding Applied");

  return (
    <div className="App">
      <h1>CollabNet</h1>
      {!currentUser ? (
        <div className="login-container">
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Login</h2>
            {loginError && <p className="error">{loginError}</p>}
            <input type="text" name="username" placeholder="Username" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Login</button>
          </form>
        </div>
      ) : (
        <>
          <nav className="navbar">
            <span>Welcome, {currentUser.name}</span>
            {currentUser.role === "student" && (
              <>
                <button onClick={() => setSelectedPage("availableProjects")}>Available Projects</button>
                <button onClick={() => setSelectedPage("myProjects")}>My Projects</button>
                <button onClick={() => setSelectedPage("createProject")}>Create Project</button>
              </>
            )}
            {currentUser.role === "funder" && (
              <button onClick={() => setSelectedPage("funding")}>Funding</button>
            )}
            <button onClick={handleLogout}>Logout</button>
          </nav>

          <div className="content">
            {selectedPage === "availableProjects" && currentUser.role === "student" && (
              <div className="project-section">
                <h2>Available Projects</h2>
                {availableProjects.map((project) => (
                  <div key={project.id} className="project-card advanced-card">
                    <h3>{project.name}</h3>
                    <p><strong>Leader:</strong> {project.leader}</p>
                    <p>{project.description}</p>
                    <p>
                      <strong>Skills:</strong> {project.skills || "No skills listed"}
                    </p>
                    <p><strong>Team Members:</strong> {project.members.join(", ")}</p>
                    <button onClick={() => joinProject(project.id)}>Join Project</button>
                  </div>
                ))}
              </div>
            )}

            {selectedPage === "myProjects" && currentUser.role === "student" && (
              <div className="project-section">
                <h2>Your Projects</h2>
                {myProjects.map((project) => (
                  <div key={project.id} className="project-card advanced-card">
                    <h3>{project.name}</h3>
                    <p><strong>Leader:</strong> {project.leader}</p>
                    <p>{project.description}</p>
                    <p>
                      <strong>Skills:</strong> {project.skills || "No skills listed"}
                    </p>
                    <p><strong>Team Members:</strong> {project.members.join(", ")}</p>
                    {project.leader === currentUser.name && project.fundingStatus === "Not Funded" && (
                      <button onClick={() => setFundingRequestProjectId(project.id)}>Apply for Funding</button>
                    )}
                    {project.fundingStatus === "Funding Applied" && (
                      <p>Status: <span className="status-applied">Funding Applied</span></p>
                    )}
                    {project.fundingStatus === "Funded" && (
                      <p>Status: <span className="status-funded">Funded</span></p>
                    )}
                    {fundingRequestProjectId === project.id && (
                      <form onSubmit={(e) => applyForFunding(e, project.id)} className="funding-form">
                        <label>Funding Amount:</label>
                        <input type="number" name="amount" required />
                        <label>Description:</label>
                        <textarea name="description" required />
                        <button type="submit">Submit Funding Request</button>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            )}

            {selectedPage === "createProject" && currentUser.role === "student" && (
              <div className="create-project-form advanced-form">
                <h2>Create a New Project</h2>
                <form onSubmit={createProject}>
                  <label>Project Name:</label>
                  <input type="text" name="name" required />
                  <label>Description:</label>
                  <textarea name="description" required />
                  <label>Skills (comma-separated):</label>
                  <textarea name="skills" required />
                  <button type="submit">Create Project</button>
                </form>
              </div>
            )}

            {selectedPage === "funding" && currentUser.role === "funder" && (
              <div className="project-section">
                <h2>Projects Seeking Funding</h2>
                {fundingAvailable.map((project) => (
                  <div key={project.id} className="project-card advanced-card">
                    <h3>{project.name}</h3>
                    <p><strong>Leader:</strong> {project.leader}</p>
                    <p>{project.description}</p>
                    <p>
                      <strong>Skills:</strong> {project.skills || "No skills listed"}
                    </p>
                    <p><strong>Team Members:</strong> {project.members.join(", ")}</p>
                    <button onClick={() => fundProject(project.id)}>Fund Project</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
