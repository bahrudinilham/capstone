import express from "express";
import { loginStudent } from "../services/authService.js";

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const payload = await loginStudent(req.body);
    return res.json(payload);
  } catch (error) {
    return next(error);
  }
});

export default router;
