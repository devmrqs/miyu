import express, { type Express } from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";

// Routes
import { authRouter } from "../routes/auth.routes.js";
import { guildsRouter } from "../routes/guilds.routes.js";
import { channelsRouter } from "../routes/channels.routes.js";
import { messagesRouter } from "../routes/messages.routes.js";
import { welcomeRouter } from "../routes/welcome.routes.js";

// Middleware
import { errorHandler } from "../middlewares/errorHandler.js";

function formatUptime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs}h ${mins}m ${secs}s`;
}

export const app: Express = express();

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI!,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
      httpOnly: true,
    },
  }),
);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: formatUptime(process.uptime()),
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use("/auth", authRouter);
app.use("/guilds", guildsRouter);
app.use("/guilds", channelsRouter);
app.use("/guilds", messagesRouter);
app.use("/guilds", welcomeRouter);

app.use(errorHandler);
