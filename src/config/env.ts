const requiredEnvVars = [
  "DISCORD_TOKEN",
  "CLIENT_ID",
  "CLIENT_SECRET",
  "REDIRECT_URI",
  "MONGODB_URI",
  "SESSION_SECRET",
  "NODE_ENV",
] as const;

export function validateEnv() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `[env] Variáveis de ambiente faltando: ${missing.join(", ")}`,
    );
    process.exit(1);
  }
}
