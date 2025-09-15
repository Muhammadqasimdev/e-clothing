import axios from 'axios';
import {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderWithPrices,
  ExchangeRates,
  ImageUploadResponse,
} from '../types/order.types';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiService {
  static async createOrder(
    orderData: CreateOrderRequest
  ): Promise<OrderWithPrices> {
    const response = await api.post('/orders', orderData);
    return response.data;
  }

  static async getOrder(id: string): Promise<OrderWithPrices> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  }

  static async getAllOrders(): Promise<OrderWithPrices[]> {
    const response = await api.get('/orders');
    return response.data;
  }

  static async updateOrder(
    id: string,
    updateData: UpdateOrderRequest
  ): Promise<OrderWithPrices> {
    const response = await api.put(`/orders/${id}`, updateData);
    return response.data;
  }

  static async deleteOrder(id: string): Promise<void> {
    await api.delete(`/orders/${id}`);
  }

  // Exchange rates
  static async getExchangeRates(): Promise<ExchangeRates> {
    const response = await api.get('/exchange-rates');
    return response.data;
  }

  // Image upload
  static async uploadImage(file: File): Promise<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to upload image');
    }
  }

  static async deleteImage(filename: string): Promise<void> {
    await api.delete(`/images/upload/${filename}`);
  }
}
