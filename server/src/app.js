import express from "express";
import cors from "cors";
import authRoutes from "./routes/Auth.js";
import dashboardRoutes from "./routes/Dashboard.js";
import pathsRoutes from "./routes/paths.js";
import coursesRoutes from "./routes/courses.js";
import activityRoutes from "./routes/Activity.js";
import { authenticate } from "./middleware/auth.js";
import recommendationRoutes from "./routes/recommendations.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", authenticate, dashboardRoutes);
app.use("/api/paths", authenticate, pathsRoutes);
app.use("/api/courses", authenticate, coursesRoutes);
app.use("/api/activity", authenticate, activityRoutes);
app.use("/api/recommendations", authenticate, recommendationRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal server error" });
});

export default app;
