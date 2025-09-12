import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';

const router = Router();
const orderController = new OrderController();

// Order routes
router.post('/orders', (req, res) => {
  console.log('POST /orders route called');
  orderController.createOrder(req, res).catch(err => {
    console.error('Error in createOrder:', err);
    res.status(500).json({ error: 'Internal server error' });
  });
});
router.get('/orders', (req, res) => {
  orderController.getAllOrders(req, res).catch(err => {
    console.error('Error in getAllOrders:', err);
    res.status(500).json({ error: 'Internal server error' });
  });
});
router.get('/orders/:id', (req, res) => {
  orderController.getOrder(req, res).catch(err => {
    console.error('Error in getOrder:', err);
    res.status(500).json({ error: 'Internal server error' });
  });
});
router.put('/orders/:id', (req, res) => {
  orderController.updateOrder(req, res).catch(err => {
    console.error('Error in updateOrder:', err);
    res.status(500).json({ error: 'Internal server error' });
  });
});
router.delete('/orders/:id', (req, res) => {
  orderController.deleteOrder(req, res).catch(err => {
    console.error('Error in deleteOrder:', err);
    res.status(500).json({ error: 'Internal server error' });
  });
});

// Exchange rate route
router.get('/exchange-rates', (req, res) => {
  orderController.getExchangeRates(req, res).catch(err => {
    console.error('Error in getExchangeRates:', err);
    res.status(500).json({ error: 'Internal server error' });
  });
});

export { router as orderRoutes };
