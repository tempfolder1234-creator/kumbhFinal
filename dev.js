const { spawn } = require("child_process");

console.log("\x1b[36m%s\x1b[0m", "[StayHub] Starting Express Backend on http://localhost:3003...");
const backend = spawn("node", ["app.js"], {
  stdio: "inherit",
  shell: true,
});

console.log("\x1b[35m%s\x1b[0m", "[StayHub] Starting Vite Frontend on http://localhost:5173...");
const frontend = spawn("npm", ["--prefix", "client", "run", "dev"], {
  stdio: "inherit",
  shell: true,
});

const cleanup = () => {
  try {
    backend.kill();
  } catch (err) {}
  try {
    frontend.kill();
  } catch (err) {}
  process.exit();
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("exit", cleanup);
