import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(__dirname, ".next", "standalone", "server.js");

const port = process.env.PORT || "8080";
const host = process.env.HOST || "0.0.0.0";

console.log(`🚀 Iniciando servidor Next.js em http://${host}:${port}`);

const child = spawn("node", [serverPath], {
  stdio: "inherit",
  env: {
    ...process.env,
    PORT: port, // força usar porta correta
    HOST: host,
  },
});

child.on("close", (code) => {
  console.log(`🧱 Servidor encerrado com código ${code}`);
});

// manter vivo
process.on("SIGINT", () => process.exit());
process.on("SIGTERM", () => process.exit());
