import express from 'express';
import { getRecommendedPath } from '../services/dashboardService.js';

const router = express.Router();

router.get('/next-path', async (req, res, next) => {
  try {
    const recommendation = await getRecommendedPath(req.user.id);
    if (!recommendation) {
      return res.status(204).end();
    }
    return res.json(recommendation);
  } catch (error) {
    return next(error);
  }
}); 


export default router;
