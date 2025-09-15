import {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  PriceInCurrencies,
  ExchangeRates,
} from '../types/order.types';
import { ExchangeRateService } from './exchange-rate.service';

export class OrderService {
  private orders: Map<string, Order> = new Map();
  private exchangeRateService: ExchangeRateService;

  constructor() {
    this.exchangeRateService = new ExchangeRateService();
  }

  private readonly BASE_PRICES = {
    tshirt: {
      'light-cotton': {
        black: 16.95,
        white: 16.95,
        green: 18.95,
        red: 18.95,
      },
      'heavy-cotton': {
        black: 19.95,
        white: 19.95,
        green: 21.95,
        red: 21.95,
      },
    },
    sweater: {
      black: 28.95,
      white: 28.95,
      pink: 32.95,
      yellow: 32.95,
    },
  };

  private readonly TEXT_PRICE = 5;
  private readonly IMAGE_PRICE = 10;

  createOrder(request: CreateOrderRequest): Order {
    const id = this.generateId();
    const basePrice = this.calculateBasePrice(
      request.productType,
      request.material,
      request.color
    );
    const textPrice = this.calculateTextPrice(request.customText);
    const imagePrice = request.imageUrl ? this.IMAGE_PRICE : 0;
    const totalPrice = basePrice + textPrice + imagePrice;

    const order: Order = {
      id,
      productType: request.productType,
      material: request.material,
      color: request.color,
      customText: request.customText,
      imageUrl: request.imageUrl,
      basePrice,
      totalPrice,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.orders.set(id, order);
    return order;
  }

  getOrder(id: string): Order | undefined {
    return this.orders.get(id);
  }

  getAllOrders(): Order[] {
    return Array.from(this.orders.values());
  }

  updateOrder(id: string, request: UpdateOrderRequest): Order | null {
    const order = this.orders.get(id);
    if (!order) {
      return null;
    }

    if (request.material !== undefined) order.material = request.material;
    if (request.color !== undefined) order.color = request.color;
    if (request.customText !== undefined) order.customText = request.customText;
    if (request.imageUrl !== undefined) order.imageUrl = request.imageUrl;

    order.basePrice = this.calculateBasePrice(
      order.productType,
      order.material,
      order.color
    );
    const textPrice = this.calculateTextPrice(order.customText);
    const imagePrice = order.imageUrl ? this.IMAGE_PRICE : 0;
    order.totalPrice = order.basePrice + textPrice + imagePrice;
    order.updatedAt = new Date();

    this.orders.set(id, order);
    return order;
  }

  deleteOrder(id: string): boolean {
    return this.orders.delete(id);
  }

  async getPriceInCurrencies(priceCAD: number): Promise<PriceInCurrencies> {
    const rates = await this.exchangeRateService.getExchangeRates();

    return {
      CAD: priceCAD,
      USD: priceCAD * rates.USD,
      EUR: priceCAD * rates.EUR,
    };
  }

  async getExchangeRates(): Promise<ExchangeRates> {
    return await this.exchangeRateService.getExchangeRates();
  }

  private calculateBasePrice(
    productType: 'tshirt' | 'sweater',
    material?: 'light-cotton' | 'heavy-cotton',
    color?: string
  ): number {
    if (productType === 'tshirt') {
      const materialKey = material || 'light-cotton';
      const materialPrices = this.BASE_PRICES.tshirt[materialKey];
      return materialPrices[color as keyof typeof materialPrices] || 0;
    } else {
      return (
        this.BASE_PRICES.sweater[
          color as keyof typeof this.BASE_PRICES.sweater
        ] || 0
      );
    }
  }

  private calculateTextPrice(customText?: string): number {
    if (!customText) return 0;
    return customText.length > 8 ? this.TEXT_PRICE : 0;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
