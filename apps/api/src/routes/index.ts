import { Router } from 'express';
import { orderRoutes } from './order.routes';
import { imageRoutes } from './image.routes';

const router = Router();

router.use(orderRoutes);
router.use(imageRoutes);

export { router as routes };
