import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(__dirname, ".next", "standalone", "server.js");

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost"; // muda aqui 👈

console.log(`🚀 Iniciando servidor em http://${host}:${port}`);

const child = spawn("node", [serverPath], {
  stdio: "inherit",
  env: { ...process.env, PORT: port, HOST: host },
});

child.on("close", (code) => {
  console.log(`🧱 Servidor Next encerrado com código ${code}`);
});
