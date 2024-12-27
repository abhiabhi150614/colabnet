const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database setup
const db = new sqlite3.Database("app.db", (err) => {
  if (err) console.error("Error connecting to database:", err.message);
  console.log("Connected to SQLite database.");
});

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      skills TEXT,
      leader TEXT,
      members TEXT,
      fundingStatus TEXT,
      fundingAmount REAL,
      fundingDescription TEXT
    )
  `);

  // Seed users
  db.run(`
    INSERT OR IGNORE INTO users (id, name, password, role)
    VALUES 
      (1, 'User1', 'password1', 'student'),
      (2, 'User2', 'password2', 'student'),
      (3, 'User3', 'password3', 'student'),
      (4, 'User4', 'password4', 'student'),
      (5, 'Funder', 'funderpass', 'funder')
  `);
});

// User login
app.post("/api/login", (req, res) => {
  const { name, password } = req.body;
  db.get(
    "SELECT * FROM users WHERE name = ? AND password = ?",
    [name, password],
    (err, user) => {
      if (err) {
        console.error("Error fetching user:", err.message);
        return res.status(500).send("Server error.");
      }
      if (!user) return res.status(401).send("Invalid username or password.");
      res.json(user);
    }
  );
});

// Get all projects
app.get("/api/projects", (req, res) => {
  db.all("SELECT * FROM projects", [], (err, projects) => {
    if (err) {
      console.error("Error fetching projects:", err.message);
      return res.status(500).send("Server error.");
    }
    res.json(projects.map((project) => ({ ...project, members: JSON.parse(project.members || "[]") })));
  });
});

// Add a new project
app.post("/api/projects", (req, res) => {
  const { name, description, skills, leader } = req.body;
  db.run(
    "INSERT INTO projects (name, description, skills, leader, members, fundingStatus) VALUES (?, ?, ?, ?, ?, ?)",
    [name, description, skills, leader, JSON.stringify([]), "Not Funded"],
    function (err) {
      if (err) {
        console.error("Error inserting project:", err.message);
        return res.status(500).send("Server error.");
      }
      res.json({ id: this.lastID, name, description, skills, leader, members: [], fundingStatus: "Not Funded" });
    }
  );
});

// Update project (add member or funding details)
app.put("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  const { members, fundingStatus, fundingAmount, fundingDescription } = req.body;

  db.run(
    "UPDATE projects SET members = ?, fundingStatus = ?, fundingAmount = ?, fundingDescription = ? WHERE id = ?",
    [JSON.stringify(members), fundingStatus, fundingAmount, fundingDescription, id],
    function (err) {
      if (err) {
        console.error("Error updating project:", err.message);
        return res.status(500).send("Server error.");
      }
      res.json({ id });
    }
  );
});

/// Example Express route for deleting a project
app.delete('/api/projects/:id', (req, res) => {
    const { id } = req.params;
  
    // Assuming you are using a database like MongoDB
    Project.findByIdAndDelete(id)
      .then((project) => {
        if (!project) {
          return res.status(404).send({ message: 'Project not found' });
        }
        res.status(200).send({ message: 'Project deleted successfully' });
      })
      .catch((error) => {
        res.status(500).send({ message: 'Error deleting project', error });
      });
  });
  
// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
