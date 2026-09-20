import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: { error: "Muitas requisições. Tente novamente mais tarde." },
});
