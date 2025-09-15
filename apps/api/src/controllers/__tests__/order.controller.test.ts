import { Request, Response } from 'express';
import { OrderController } from '../order.controller';
import { OrderService } from '../../services/order.service';
import { CreateOrderRequest, UpdateOrderRequest } from '../../types/order.types';

jest.mock('../../services/order.service');
const MockedOrderService = OrderService as jest.MockedClass<typeof OrderService>;

describe('OrderController', () => {
  let orderController: OrderController;
  let mockOrderService: jest.Mocked<OrderService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockOrderService = {
      createOrder: jest.fn(),
      getOrder: jest.fn(),
      getAllOrders: jest.fn(),
      updateOrder: jest.fn(),
      deleteOrder: jest.fn(),
      getPriceInCurrencies: jest.fn(),
      getExchangeRates: jest.fn(),
    } as any;

    MockedOrderService.mockImplementation(() => mockOrderService);

    orderController = new OrderController();

    mockRequest = {
      body: {},
      params: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const orderData: CreateOrderRequest = {
        productType: 'tshirt',
        material: 'light-cotton',
        color: 'black',
        customText: 'Test',
      };

      const mockOrder = {
        id: 'test-id',
        productType: 'tshirt' as const,
        material: 'light-cotton' as const,
        color: 'black' as const,
        customText: 'Test',
        basePrice: 16.95,
        totalPrice: 16.95,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockPriceInCurrencies = {
        CAD: 16.95,
        USD: 12.54,
        EUR: 11.53,
      };

      mockRequest.body = orderData;
      mockOrderService.createOrder.mockReturnValue(mockOrder);
      mockOrderService.getPriceInCurrencies.mockResolvedValue(mockPriceInCurrencies);

      await orderController.createOrder(mockRequest as Request, mockResponse as Response);

      expect(mockOrderService.createOrder).toHaveBeenCalledWith(orderData);
      expect(mockOrderService.getPriceInCurrencies).toHaveBeenCalledWith(16.95);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        order: mockOrder,
        priceInCurrencies: mockPriceInCurrencies,
      });
    });

    it('should return 400 when productType is missing', async () => {
      mockRequest.body = { color: 'black' };

      await orderController.createOrder(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'productType and color are required',
      });
      expect(mockOrderService.createOrder).not.toHaveBeenCalled();
    });

    it('should return 400 when color is missing', async () => {
      mockRequest.body = { productType: 'tshirt' };

      await orderController.createOrder(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'productType and color are required',
      });
    });

    it('should return 400 when material is missing for t-shirt', async () => {
      mockRequest.body = {
        productType: 'tshirt',
        color: 'black',
      };

      await orderController.createOrder(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'material is required for t-shirts',
      });
    });

    it('should handle service errors', async () => {
      mockRequest.body = {
        productType: 'tshirt',
        material: 'light-cotton',
        color: 'black',
      };

      mockOrderService.createOrder.mockImplementation(() => {
        throw new Error('Service error');
      });

      await orderController.createOrder(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to create order',
      });
    });
  });

  describe('getOrder', () => {
    it('should return an order successfully', async () => {
      const mockOrder = {
        id: 'test-id',
        productType: 'tshirt' as const,
        material: 'light-cotton' as const,
        color: 'black' as const,
        basePrice: 16.95,
        totalPrice: 16.95,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockPriceInCurrencies = {
        CAD: 16.95,
        USD: 12.54,
        EUR: 11.53,
      };

      mockRequest.params = { id: 'test-id' };
      mockOrderService.getOrder.mockReturnValue(mockOrder);
      mockOrderService.getPriceInCurrencies.mockResolvedValue(mockPriceInCurrencies);

      await orderController.getOrder(mockRequest as Request, mockResponse as Response);

      expect(mockOrderService.getOrder).toHaveBeenCalledWith('test-id');
      expect(mockOrderService.getPriceInCurrencies).toHaveBeenCalledWith(16.95);
      expect(mockResponse.json).toHaveBeenCalledWith({
        order: mockOrder,
        priceInCurrencies: mockPriceInCurrencies,
      });
    });

    it('should return 404 when order not found', async () => {
      mockRequest.params = { id: 'non-existent' };
      mockOrderService.getOrder.mockReturnValue(undefined);

      await orderController.getOrder(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Order not found',
      });
    });

    it('should handle service errors', async () => {
      mockRequest.params = { id: 'test-id' };
      mockOrderService.getOrder.mockImplementation(() => {
        throw new Error('Service error');
      });

      await orderController.getOrder(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to get order',
      });
    });
  });

  describe('getAllOrders', () => {
    it('should return all orders successfully', async () => {
      const mockOrders = [
        {
          id: 'order-1',
          productType: 'tshirt' as const,
          material: 'light-cotton' as const,
          color: 'black' as const,
          basePrice: 16.95,
          totalPrice: 16.95,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'order-2',
          productType: 'sweater' as const,
          color: 'white' as const,
          basePrice: 28.95,
          totalPrice: 28.95,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockPriceInCurrencies = {
        CAD: 16.95,
        USD: 12.54,
        EUR: 11.53,
      };

      mockOrderService.getAllOrders.mockReturnValue(mockOrders);
      mockOrderService.getPriceInCurrencies.mockResolvedValue(mockPriceInCurrencies);

      await orderController.getAllOrders(mockRequest as Request, mockResponse as Response);

      expect(mockOrderService.getAllOrders).toHaveBeenCalled();
      expect(mockOrderService.getPriceInCurrencies).toHaveBeenCalledTimes(2);
      expect(mockResponse.json).toHaveBeenCalledWith([
        { order: mockOrders[0], priceInCurrencies: mockPriceInCurrencies },
        { order: mockOrders[1], priceInCurrencies: mockPriceInCurrencies },
      ]);
    });

    it('should handle service errors', async () => {
      mockOrderService.getAllOrders.mockImplementation(() => {
        throw new Error('Service error');
      });

      await orderController.getAllOrders(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to get orders',
      });
    });
  });

  describe('updateOrder', () => {
    it('should update an order successfully', async () => {
      const updateData: UpdateOrderRequest = {
        color: 'white',
        customText: 'Updated',
      };

      const mockOrder = {
        id: 'test-id',
        productType: 'tshirt' as const,
        material: 'light-cotton' as const,
        color: 'white' as const,
        customText: 'Updated',
        basePrice: 16.95,
        totalPrice: 21.95,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockPriceInCurrencies = {
        CAD: 21.95,
        USD: 16.24,
        EUR: 14.93,
      };

      mockRequest.params = { id: 'test-id' };
      mockRequest.body = updateData;
      mockOrderService.updateOrder.mockReturnValue(mockOrder);
      mockOrderService.getPriceInCurrencies.mockResolvedValue(mockPriceInCurrencies);

      await orderController.updateOrder(mockRequest as Request, mockResponse as Response);

      expect(mockOrderService.updateOrder).toHaveBeenCalledWith('test-id', updateData);
      expect(mockOrderService.getPriceInCurrencies).toHaveBeenCalledWith(21.95);
      expect(mockResponse.json).toHaveBeenCalledWith({
        order: mockOrder,
        priceInCurrencies: mockPriceInCurrencies,
      });
    });

    it('should return 404 when order not found', async () => {
      mockRequest.params = { id: 'non-existent' };
      mockRequest.body = { color: 'white' };
      mockOrderService.updateOrder.mockReturnValue(null);

      await orderController.updateOrder(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Order not found',
      });
    });

    it('should handle service errors', async () => {
      mockRequest.params = { id: 'test-id' };
      mockRequest.body = { color: 'white' };
      mockOrderService.updateOrder.mockImplementation(() => {
        throw new Error('Service error');
      });

      await orderController.updateOrder(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to update order',
      });
    });
  });

  describe('deleteOrder', () => {
    it('should delete an order successfully', async () => {
      mockRequest.params = { id: 'test-id' };
      mockOrderService.deleteOrder.mockReturnValue(true);

      await orderController.deleteOrder(mockRequest as Request, mockResponse as Response);

      expect(mockOrderService.deleteOrder).toHaveBeenCalledWith('test-id');
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should return 404 when order not found', async () => {
      mockRequest.params = { id: 'non-existent' };
      mockOrderService.deleteOrder.mockReturnValue(false);

      await orderController.deleteOrder(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Order not found',
      });
    });

    it('should handle service errors', async () => {
      mockRequest.params = { id: 'test-id' };
      mockOrderService.deleteOrder.mockImplementation(() => {
        throw new Error('Service error');
      });

      await orderController.deleteOrder(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to delete order',
      });
    });
  });

  describe('getExchangeRates', () => {
    it('should return exchange rates successfully', async () => {
      const mockRates = {
        CAD: 1.0,
        USD: 0.74,
        EUR: 0.68,
      };

      mockOrderService.getExchangeRates.mockResolvedValue(mockRates);

      await orderController.getExchangeRates(mockRequest as Request, mockResponse as Response);

      expect(mockOrderService.getExchangeRates).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockRates);
    });

    it('should handle service errors', async () => {
      mockOrderService.getExchangeRates.mockImplementation(() => {
        throw new Error('Service error');
      });

      await orderController.getExchangeRates(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to get exchange rates',
      });
    });
  });
});
