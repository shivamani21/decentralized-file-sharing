const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");  // Password hashing

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Shivamani@2002",
  database: process.env.DB_NAME || "file_sharing",
  connectionLimit: 10,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL Connection Failed:", err.message);
    return;
  }
  console.log("✅ Connected to MySQL");
  connection.release();
});

// ✅ Register & Auto-Login
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users (user_address, password) VALUES (?, ?)";
    db.query(query, [username, hashedPassword], (err, result) => {
      if (err) {
        console.error("❌ Registration failed:", err);
        return res.status(500).json({ error: "Database error" });
      }
      console.log(`✅ User registered: ${username}`);

      // Auto-login after registration
      res.json({ success: true, message: "Registration successful", loggedIn: true });
    });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  try {
    const query = "SELECT * FROM users WHERE user_address = ?";
    db.query(query, [username], async (err, result) => {
      if (err) {
        console.error("❌ Database query error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (result.length > 0) {
        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          console.log(`✅ Login successful for user: ${username}`);
          res.json({ success: true, message: "Login successful" });
        } else {
          console.log(`❌ Invalid login attempt: ${username}`);
          res.status(401).json({ success: false, message: "Invalid credentials" });
        }
      } else {
        console.log(`❌ User not found: ${username}`);
        res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
