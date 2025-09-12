import { ExchangeRates } from '../types/order.types';

export class ExchangeRateService {
  private readonly API_KEY = '56979d1a5fbca8521a5de76a6691a6ae';
  private readonly BASE_URL = 'https://api.exchangeratesapi.io/v1/latest';
  private cache: { rates: ExchangeRates; timestamp: number } | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getExchangeRates(): Promise<ExchangeRates> {
    // Check cache first
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
        CAD: 1.0, // Base currency
        USD: data.rates.USD,
        EUR: data.rates.EUR,
      };

      // Cache the result
      this.cache = {
        rates,
        timestamp: Date.now(),
      };

      return rates;
    } catch (error) {
      console.warn('Failed to fetch exchange rates, using fallback:', error);
      return this.getFallbackRates();
    }
  }

  private getFallbackRates(): ExchangeRates {
    // Fallback rates (approximate values)
    return {
      CAD: 1.0,
      USD: 0.74, // 1 CAD = 0.74 USD
      EUR: 0.68, // 1 CAD = 0.68 EUR
    };
  }
}
