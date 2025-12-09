import express from "express";
import { getWeeklyActivity } from "../services/dashboardService.js";

const router = express.Router();

router.get("/weekly", async (req, res, next) => {
  try {
    const activity = await getWeeklyActivity(req.user.id);
    return res.json({
      daily: activity.dailySeries,
      cumulative: activity.cumulativeSeries,
      totalMinutes: activity.totalMinutes,
      wowDeltaPct: activity.wowDeltaPct,
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
