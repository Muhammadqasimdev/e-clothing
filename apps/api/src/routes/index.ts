import { Router } from 'express';
import { userRoutes } from './user.routes';
import { orderRoutes } from './order.routes';
import { imageRoutes } from './image.routes';

export const routes = Router();

routes.use('/users', userRoutes);
routes.use('/', orderRoutes);
routes.use('/images', imageRoutes);
