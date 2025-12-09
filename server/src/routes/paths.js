import express from 'express';
import { getPathsOverview, getPathDetail } from '../services/dashboardService.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const paths = await getPathsOverview(req.user.id);
    return res.json(paths);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id/detail', async (req, res, next) => {
  try {
    const detail = await getPathDetail(req.user.id, req.params.id);
    if (!detail) {
      return res.status(404).json({ message: 'Learning path not found' });
    }
    return res.json(detail);
  } catch (error) {
    return next(error);
  }
});

export default router;
