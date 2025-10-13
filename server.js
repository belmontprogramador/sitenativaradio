import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(__dirname, ".next", "standalone", "server.js");

// usa a porta do Railway automaticamente ou 3000 localmente
const port = process.env.PORT || 3000;

// define o host corretamente conforme o ambiente
const host = process.env.RAILWAY_ENVIRONMENT ? "0.0.0.0" : "127.0.0.1";

console.log(`🚀 Iniciando servidor Next.js em http://${host}:${port}`);

const child = spawn("node", [serverPath], {
  stdio: "inherit",
  env: { ...process.env, PORT: port, HOST: host },
});

child.on("close", (code) => {
  console.log(`🧱 Servidor encerrado com código ${code}`);
});
