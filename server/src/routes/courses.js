import express from 'express';
import { getStandaloneCourses } from '../services/dashboardService.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { type } = req.query;
    if (type === 'standalone') {
      const courses = await getStandaloneCourses(req.user.id);
      return res.json(courses);
    }

    return res.status(400).json({ message: 'Unsupported course filter' });
  } catch (error) {
    return next(error);
  }
});

export default router;
