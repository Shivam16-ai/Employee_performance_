import { Router } from 'express';
import healthRoutes from './healthRoutes.js';

const apiV1Router = Router();

apiV1Router.use('/', healthRoutes);

export default apiV1Router;
