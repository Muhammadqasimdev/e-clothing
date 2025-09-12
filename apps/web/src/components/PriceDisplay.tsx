import React from 'react';
import { ExchangeRates } from '../types/order.types';

interface PriceDisplayProps {
  priceCAD: number;
  exchangeRates: ExchangeRates;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ priceCAD, exchangeRates }) => {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h4 className="font-medium text-gray-900 mb-2">Price in Different Currencies</h4>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="text-center">
          <div className="font-medium text-gray-900">CAD</div>
          <div className="text-blue-600">{formatPrice(priceCAD, 'CAD')}</div>
        </div>
        <div className="text-center">
          <div className="font-medium text-gray-900">USD</div>
          <div className="text-green-600">{formatPrice(priceCAD * exchangeRates.USD, 'USD')}</div>
        </div>
        <div className="text-center">
          <div className="font-medium text-gray-900">EUR</div>
          <div className="text-purple-600">{formatPrice(priceCAD * exchangeRates.EUR, 'EUR')}</div>
        </div>
      </div>
    </div>
  );
};
