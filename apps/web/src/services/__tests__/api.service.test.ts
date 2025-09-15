import { describe, it, expect } from 'vitest';
import { ApiService } from '../api.service';

// Simple test without complex mocking
describe('ApiService', () => {
  describe('Basic functionality', () => {
    it('should be importable', () => {
      expect(ApiService).toBeDefined();
    });

    it('should have static methods', () => {
      expect(typeof ApiService.createOrder).toBe('function');
      expect(typeof ApiService.getOrder).toBe('function');
      expect(typeof ApiService.getAllOrders).toBe('function');
      expect(typeof ApiService.updateOrder).toBe('function');
      expect(typeof ApiService.deleteOrder).toBe('function');
      expect(typeof ApiService.getExchangeRates).toBe('function');
      expect(typeof ApiService.uploadImage).toBe('function');
      expect(typeof ApiService.deleteImage).toBe('function');
    });
  });
});