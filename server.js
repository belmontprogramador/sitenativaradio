import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(__dirname, ".next", "standalone", "server.js");

// 👉 Usa a porta fornecida automaticamente pelo Railway
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const host = process.env.HOST || "0.0.0.0";

console.log(`🚀 Iniciando servidor Next.js em http://${host}:${port}`);

const child = spawn("node", [serverPath], {
  stdio: "inherit",
  env: { ...process.env, PORT: port, HOST: host },
});

child.on("close", (code) => {
  console.log(`🧱 Servidor encerrado com código ${code}`);
});
