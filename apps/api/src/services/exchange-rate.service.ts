import { ExchangeRates } from '../types/order.types';

export class ExchangeRateService {
  private readonly API_KEY = '56979d1a5fbca8521a5de76a6691a6ae';
  private readonly BASE_URL = 'https://api.exchangeratesapi.io/v1/latest';
  private cache: { rates: ExchangeRates; timestamp: number } | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000;

  async getExchangeRates(): Promise<ExchangeRates> {
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_DURATION) {
      return this.cache.rates;
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}?access_key=${this.API_KEY}&base=CAD&symbols=USD,EUR`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(`API error: ${data.error?.info || 'Unknown error'}`);
      }

      const rates: ExchangeRates = {
        CAD: 1.0,
        USD: data.rates.USD,
        EUR: data.rates.EUR,
      };

      this.cache = {
        rates,
        timestamp: Date.now(),
      };

      return rates;
    } catch (error) {
      return this.getFallbackRates();
    }
  }

  private getFallbackRates(): ExchangeRates {
    return {
      CAD: 1.0,
      USD: 0.74,
      EUR: 0.68,
    };
  }
}
