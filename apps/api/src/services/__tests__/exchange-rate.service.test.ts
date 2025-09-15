import { ExchangeRateService } from '../exchange-rate.service';

global.fetch = jest.fn();

describe('ExchangeRateService', () => {
  let exchangeRateService: ExchangeRateService;

  beforeEach(() => {
    exchangeRateService = new ExchangeRateService();
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getExchangeRates', () => {
    it('should return cached rates when cache is valid', async () => {
      const mockResponse = {
        success: true,
        rates: {
          USD: 0.74,
          EUR: 0.68,
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const rates1 = await exchangeRateService.getExchangeRates();
      
      const rates2 = await exchangeRateService.getExchangeRates();

      expect(rates1).toEqual({
        CAD: 1.0,
        USD: 0.74,
        EUR: 0.68,
      });
      expect(rates2).toEqual(rates1);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should fetch new rates when cache is expired', async () => {
      const mockResponse = {
        success: true,
        rates: {
          USD: 0.75,
          EUR: 0.69,
        },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await exchangeRateService.getExchangeRates();

      jest.advanceTimersByTime(5 * 60 * 1000 + 1);

      const rates = await exchangeRateService.getExchangeRates();

      expect(rates).toEqual({
        CAD: 1.0,
        USD: 0.75,
        EUR: 0.69,
      });
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should handle API error and return fallback rates', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const rates = await exchangeRateService.getExchangeRates();

      expect(rates).toEqual({
        CAD: 1.0,
        USD: 0.74,
        EUR: 0.68,
      });
    });

    it('should handle API success false and return fallback rates', async () => {
      const mockResponse = {
        success: false,
        error: {
          info: 'Invalid API key',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const rates = await exchangeRateService.getExchangeRates();

      expect(rates).toEqual({
        CAD: 1.0,
        USD: 0.74,
        EUR: 0.68,
      });
    });

    it('should handle network error and return fallback rates', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const rates = await exchangeRateService.getExchangeRates();

      expect(rates).toEqual({
        CAD: 1.0,
        USD: 0.74,
        EUR: 0.68,
      });
    });

    it('should make correct API call', async () => {
      const mockResponse = {
        success: true,
        rates: {
          USD: 0.74,
          EUR: 0.68,
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await exchangeRateService.getExchangeRates();

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.exchangeratesapi.io/v1/latest?access_key=56979d1a5fbca8521a5de76a6691a6ae&base=CAD&symbols=USD,EUR'
      );
    });
  });
});
