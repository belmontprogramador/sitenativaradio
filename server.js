import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(__dirname, ".next", "standalone", "server.js");

// Railway usa PORT=8080
const port = process.env.PORT || "8080";
const host = process.env.HOST || "0.0.0.0";

console.log(`🚀 Iniciando servidor Next.js em http://${host}:${port}`);

const child = spawn("node", [serverPath], {
  stdio: "inherit",
  env: {
    ...process.env,
    PORT: port, // 🔥 garante que o Next ouça a porta correta no Railway
    HOST: host,
  },
});

child.on("close", (code) => {
  console.log(`🧱 Servidor encerrado com código ${code}`);
});

// evita encerramento precoce
process.on("SIGINT", () => process.exit());
process.on("SIGTERM", () => process.exit());
