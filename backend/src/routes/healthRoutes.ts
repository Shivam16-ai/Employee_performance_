import { Router } from 'express';
import { HealthController } from '../controllers/healthController.js';

const router = Router();

router.get('/health', HealthController.getHealth);
router.get('/health/db', HealthController.getDatabaseHealth);

export default router;
