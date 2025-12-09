import express from "express";
import { getKpis } from "../services/dashboardService.js";

const router = express.Router();

router.get("/summary", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const kpis = await getKpis(userId);

    return res.json({
      kpis,
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
