import "dotenv/config";
import { validateEnv } from "./config/env.js";
import { client } from "./config/client.js";
import { connectDatabase } from "./config/database.js";
import { loadEvents } from "./utils/loadEvents.js";
import { loadCommands } from "./utils/loadCommands.js";
import { startServer } from "./utils/startServer.js";

process.on("unhandledRejection", (reason) => {
  console.error("[process] promise rejeitada sem tratamento:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("[process] exceção não capturada:", error);
});

validateEnv();

const { DISCORD_TOKEN } = process.env;

await connectDatabase();
await loadCommands(client);
await loadEvents(client);
startServer();

client.login(DISCORD_TOKEN);
