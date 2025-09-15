import React from 'react';
import { render, screen } from '@testing-library/react';
import { PriceDisplay } from '../PriceDisplay';
import { ExchangeRates } from '../../types/order.types';

describe('PriceDisplay', () => {
  const mockExchangeRates: ExchangeRates = {
    CAD: 1.0,
    USD: 0.74,
    EUR: 0.68,
  };

  it('should render price in all currencies', () => {
    render(
      <PriceDisplay
        priceCAD={100}
        exchangeRates={mockExchangeRates}
      />
    );

    expect(screen.getByText('Price in Different Currencies')).toBeInTheDocument();
    expect(screen.getByText('CAD')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('EUR')).toBeInTheDocument();
  });

  it('should format CAD price correctly', () => {
    render(
      <PriceDisplay
        priceCAD={16.95}
        exchangeRates={mockExchangeRates}
      />
    );

    expect(screen.getByText('$16.95')).toBeInTheDocument();
  });

  it('should calculate and format USD price correctly', () => {
    render(
      <PriceDisplay
        priceCAD={100}
        exchangeRates={mockExchangeRates}
      />
    );

    // 100 * 0.74 = 74
    expect(screen.getByText('US$74.00')).toBeInTheDocument();
  });

  it('should calculate and format EUR price correctly', () => {
    render(
      <PriceDisplay
        priceCAD={100}
        exchangeRates={mockExchangeRates}
      />
    );

    // 100 * 0.68 = 68
    expect(screen.getByText('€68.00')).toBeInTheDocument();
  });

  it('should handle decimal prices correctly', () => {
    render(
      <PriceDisplay
        priceCAD={16.95}
        exchangeRates={mockExchangeRates}
      />
    );

    // CAD: 16.95
    expect(screen.getByText('$16.95')).toBeInTheDocument();
    
    // USD: 16.95 * 0.74 = 12.543
    expect(screen.getByText('US$12.54')).toBeInTheDocument();
    
    // EUR: 16.95 * 0.68 = 11.526
    expect(screen.getByText('€11.53')).toBeInTheDocument();
  });

  it('should handle zero price', () => {
    render(
      <PriceDisplay
        priceCAD={0}
        exchangeRates={mockExchangeRates}
      />
    );

    expect(screen.getByText('$0.00')).toBeInTheDocument();
    expect(screen.getByText('$0.00')).toBeInTheDocument();
    expect(screen.getByText('€0.00')).toBeInTheDocument();
  });

  it('should handle large prices', () => {
    render(
      <PriceDisplay
        priceCAD={1000}
        exchangeRates={mockExchangeRates}
      />
    );

    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
    expect(screen.getByText('US$740.00')).toBeInTheDocument();
    expect(screen.getByText('€680.00')).toBeInTheDocument();
  });

  it('should apply correct CSS classes', () => {
    render(
      <PriceDisplay
        priceCAD={100}
        exchangeRates={mockExchangeRates}
      />
    );

    // Check that currency labels have correct classes
    const cadLabel = screen.getByText('CAD');
    const usdLabel = screen.getByText('USD');
    const eurLabel = screen.getByText('EUR');

    expect(cadLabel).toHaveClass('font-medium', 'text-gray-900');
    expect(usdLabel).toHaveClass('font-medium', 'text-gray-900');
    expect(eurLabel).toHaveClass('font-medium', 'text-gray-900');

    // Check that prices have correct color classes
    const cadPrice = screen.getByText('$100.00');
    const usdPrice = screen.getByText('US$74.00');
    const eurPrice = screen.getByText('€68.00');

    expect(cadPrice).toHaveClass('text-blue-600');
    expect(usdPrice).toHaveClass('text-green-600');
    expect(eurPrice).toHaveClass('text-purple-600');
  });

  it('should render with different exchange rates', () => {
    const differentRates: ExchangeRates = {
      CAD: 1.0,
      USD: 0.80,
      EUR: 0.90,
    };

    render(
      <PriceDisplay
        priceCAD={50}
        exchangeRates={differentRates}
      />
    );

    expect(screen.getByText('$50.00')).toBeInTheDocument(); // CAD
    expect(screen.getByText('US$40.00')).toBeInTheDocument(); // USD: 50 * 0.80
    expect(screen.getByText('€45.00')).toBeInTheDocument(); // EUR: 50 * 0.90
  });

  it('should handle very small prices', () => {
    render(
      <PriceDisplay
        priceCAD={0.01}
        exchangeRates={mockExchangeRates}
      />
    );

    expect(screen.getByText('$0.01')).toBeInTheDocument();
    expect(screen.getByText('$0.01')).toBeInTheDocument(); // USD: 0.01 * 0.74 = 0.0074, rounded to 0.01
    expect(screen.getByText('€0.01')).toBeInTheDocument(); // EUR: 0.01 * 0.68 = 0.0068, rounded to 0.01
  });
});
