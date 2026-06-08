require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const studentsRouter = require("./routes/students");
const logsRouter = require("./routes/logs");

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

app.use(cors({ origin: [CORS_ORIGIN] }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  try {
    db.prepare("SELECT 1").get();
    res.json({ status: "ok", db: "ok", uptime: process.uptime() });
  } catch (err) {
    res.status(503).json({ status: "error", db: "unavailable", uptime: process.uptime() });
  }
});

app.use("/api/students", studentsRouter);
app.use("/api/logs", logsRouter);

const server = app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log("SQLite database: StudInfo.db");
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use.\n` +
      `Run this to free it:  for /f "tokens=5" %a in ('netstat -ano ^| findstr :${PORT}') do taskkill /PID %a /F`
    );
  } else {
    console.error("Server error:", { name: err.name, message: err.message, stack: err.stack });
  }
  process.exit(1);
});
