import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { CreateOrderRequest, UpdateOrderRequest } from '../types/order.types';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderData: CreateOrderRequest = req.body;

      if (!orderData.productType || !orderData.color) {
        res.status(400).json({ error: 'productType and color are required' });
        return;
      }

      if (orderData.productType === 'tshirt' && !orderData.material) {
        res.status(400).json({ error: 'material is required for t-shirts' });
        return;
      }

      const order = this.orderService.createOrder(orderData);
      const priceInCurrencies = await this.orderService.getPriceInCurrencies(
        order.totalPrice
      );

      res.status(201).json({
        order,
        priceInCurrencies,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create order' });
    }
  }

  async getOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = this.orderService.getOrder(id);

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      const priceInCurrencies = await this.orderService.getPriceInCurrencies(
        order.totalPrice
      );

      res.json({
        order,
        priceInCurrencies,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get order' });
    }
  }

  async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const orders = this.orderService.getAllOrders();
      const ordersWithPrices = await Promise.all(
        orders.map(async order => {
          const priceInCurrencies =
            await this.orderService.getPriceInCurrencies(order.totalPrice);
          return { order, priceInCurrencies };
        })
      );

      res.json(ordersWithPrices);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get orders' });
    }
  }

  async updateOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateOrderRequest = req.body;

      const order = this.orderService.updateOrder(id, updateData);

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      const priceInCurrencies = await this.orderService.getPriceInCurrencies(
        order.totalPrice
      );

      res.json({
        order,
        priceInCurrencies,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order' });
    }
  }

  async deleteOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = this.orderService.deleteOrder(id);

      if (!deleted) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete order' });
    }
  }

  async getExchangeRates(req: Request, res: Response): Promise<void> {
    try {
      const rates = await this.orderService.getExchangeRates();
      res.json(rates);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get exchange rates' });
    }
  }
}
