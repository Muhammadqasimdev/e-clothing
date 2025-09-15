import { OrderService } from '../order.service';
import { CreateOrderRequest, UpdateOrderRequest } from '../../types/order.types';

jest.mock('../exchange-rate.service', () => ({
  ExchangeRateService: jest.fn().mockImplementation(() => ({
    getExchangeRates: jest.fn().mockResolvedValue({
      CAD: 1.0,
      USD: 0.74,
      EUR: 0.68,
    }),
  })),
}));

describe('OrderService', () => {
  let orderService: OrderService;

  beforeEach(() => {
    orderService = new OrderService();
  });

  describe('createOrder', () => {
    it('should create a t-shirt order with light cotton material', () => {
      const orderData: CreateOrderRequest = {
        productType: 'tshirt',
        material: 'light-cotton',
        color: 'black',
        customText: 'Hello World',
        imageUrl: 'test-image.jpg',
      };

      const order = orderService.createOrder(orderData);

      expect(order).toMatchObject({
        productType: 'tshirt',
        material: 'light-cotton',
        color: 'black',
        customText: 'Hello World',
        imageUrl: 'test-image.jpg',
        basePrice: 16.95,
        totalPrice: 31.95, // 16.95 + 5 (text) + 10 (image)
      });
      expect(order.id).toBeDefined();
      expect(order.createdAt).toBeInstanceOf(Date);
      expect(order.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a t-shirt order with heavy cotton material', () => {
      const orderData: CreateOrderRequest = {
        productType: 'tshirt',
        material: 'heavy-cotton',
        color: 'green',
        customText: 'Test',
      };

      const order = orderService.createOrder(orderData);

      expect(order.basePrice).toBe(21.95);
      expect(order.totalPrice).toBe(21.95);
    });

    it('should create a sweater order', () => {
      const orderData: CreateOrderRequest = {
        productType: 'sweater',
        color: 'pink',
        customText: 'Sweater Text',
      };

      const order = orderService.createOrder(orderData);

      expect(order).toMatchObject({
        productType: 'sweater',
        color: 'pink',
        customText: 'Sweater Text',
        basePrice: 32.95,
        totalPrice: 37.95,
      });
      expect(order.material).toBeUndefined();
    });

    it('should calculate text price correctly for long text', () => {
      const orderData: CreateOrderRequest = {
        productType: 'tshirt',
        material: 'light-cotton',
        color: 'white',
        customText: 'This is a very long text that should trigger the text price',
      };

      const order = orderService.createOrder(orderData);

      expect(order.totalPrice).toBe(21.95);
    });

    it('should not charge for short text', () => {
      const orderData: CreateOrderRequest = {
        productType: 'tshirt',
        material: 'light-cotton',
        color: 'white',
        customText: 'Short',
      };

      const order = orderService.createOrder(orderData);

      expect(order.totalPrice).toBe(16.95);
    });

    it('should add image price when image is provided', () => {
      const orderData: CreateOrderRequest = {
        productType: 'tshirt',
        material: 'light-cotton',
        color: 'red',
        imageUrl: 'test.jpg',
      };

      const order = orderService.createOrder(orderData);

      expect(order.totalPrice).toBe(28.95);
    });
  });

  describe('getOrder', () => {
    it('should return an existing order', () => {
      const orderData: CreateOrderRequest = {
        productType: 'tshirt',
        material: 'light-cotton',
        color: 'black',
      };

      const createdOrder = orderService.createOrder(orderData);
      const retrievedOrder = orderService.getOrder(createdOrder.id);

      expect(retrievedOrder).toEqual(createdOrder);
    });

    it('should return undefined for non-existent order', () => {
      const order = orderService.getOrder('non-existent-id');
      expect(order).toBeUndefined();
    });
  });

  describe('getAllOrders', () => {
    it('should return all orders', () => {
      const order1 = orderService.createOrder({
        productType: 'tshirt',
        material: 'light-cotton',
        color: 'black',
      });
      const order2 = orderService.createOrder({
        productType: 'sweater',
        color: 'white',
      });

      const allOrders = orderService.getAllOrders();

      expect(allOrders).toHaveLength(2);
      expect(allOrders).toContain(order1);
      expect(allOrders).toContain(order2);
    });

    it('should return empty array when no orders exist', () => {
      const allOrders = orderService.getAllOrders();
      expect(allOrders).toEqual([]);
    });
  });

  describe('updateOrder', () => {
    it('should update an existing order', async () => {
      const orderData: CreateOrderRequest = {
        productType: 'tshirt',
        material: 'light-cotton',
        color: 'black',
        customText: 'Original',
      };

      const createdOrder = orderService.createOrder(orderData);
      const updateData: UpdateOrderRequest = {
        color: 'white',
        customText: 'Updated Text',
      };

      const updatedOrder = orderService.updateOrder(createdOrder.id, updateData);

      expect(updatedOrder).toMatchObject({
        id: createdOrder.id,
        productType: 'tshirt',
        material: 'light-cotton',
        color: 'white',
        customText: 'Updated Text',
        basePrice: 16.95,
        totalPrice: 21.95,
      });
      expect(updatedOrder?.updatedAt).toBeDefined();
      expect(updatedOrder?.updatedAt).toBeInstanceOf(Date);
    });

    it('should return null for non-existent order', () => {
      const updateData: UpdateOrderRequest = {
        color: 'white',
      };

      const updatedOrder = orderService.updateOrder('non-existent-id', updateData);
      expect(updatedOrder).toBeNull();
    });

    it('should recalculate price when updating material', () => {
      const orderData: CreateOrderRequest = {
        productType: 'tshirt',
        material: 'light-cotton',
        color: 'black',
      };

      const createdOrder = orderService.createOrder(orderData);
      const updateData: UpdateOrderRequest = {
        material: 'heavy-cotton',
      };

      const updatedOrder = orderService.updateOrder(createdOrder.id, updateData);

      expect(updatedOrder?.basePrice).toBe(19.95);
      expect(updatedOrder?.totalPrice).toBe(19.95);
    });
  });

  describe('deleteOrder', () => {
    it('should delete an existing order', () => {
      const orderData: CreateOrderRequest = {
        productType: 'tshirt',
        material: 'light-cotton',
        color: 'black',
      };

      const createdOrder = orderService.createOrder(orderData);
      const deleted = orderService.deleteOrder(createdOrder.id);

      expect(deleted).toBe(true);
      expect(orderService.getOrder(createdOrder.id)).toBeUndefined();
    });

    it('should return false for non-existent order', () => {
      const deleted = orderService.deleteOrder('non-existent-id');
      expect(deleted).toBe(false);
    });
  });

  describe('getPriceInCurrencies', () => {
    it('should return price in different currencies', async () => {
      const priceInCurrencies = await orderService.getPriceInCurrencies(100);

      expect(priceInCurrencies).toEqual({
        CAD: 100,
        USD: 74,
        EUR: 68,
      });
    });
  });

  describe('getExchangeRates', () => {
    it('should return exchange rates', async () => {
      const rates = await orderService.getExchangeRates();

      expect(rates).toEqual({
        CAD: 1.0,
        USD: 0.74,
        EUR: 0.68,
      });
    });
  });
});
