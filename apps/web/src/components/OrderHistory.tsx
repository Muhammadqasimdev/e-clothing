import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api.service';
import { OrderWithPrices } from '../types/order.types';
import { ProductPreview } from './ProductPreview';
import { PriceDisplay } from './PriceDisplay';

export const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<OrderWithPrices[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const ordersData = await ApiService.getAllOrders();
      setOrders(ordersData);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await ApiService.deleteOrder(orderId);
      setOrders(orders.filter(order => order.order.id !== orderId));
    } catch (err) {
      setError('Failed to delete order');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
        <div className="text-center py-8">
          <p className="text-gray-600">
            No orders found. Create your first order!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map(orderData => (
          <div
            key={orderData.order.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {orderData.order.productType === 'tshirt'
                    ? 'T-Shirt'
                    : 'Sweater'}
                </h3>
                <button
                  onClick={() => handleDeleteOrder(orderData.order.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>

              <div className="mb-4">
                <ProductPreview
                  productType={orderData.order.productType}
                  color={orderData.order.color}
                  customText={orderData.order.customText}
                  imageUrl={orderData.order.imageUrl}
                />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Color:</span>
                  <span className="font-medium capitalize">
                    {orderData.order.color}
                  </span>
                </div>

                {orderData.order.material && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Material:</span>
                    <span className="font-medium capitalize">
                      {orderData.order.material.replace('-', ' ')}
                    </span>
                  </div>
                )}

                {orderData.order.customText && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Text:</span>
                    <span className="font-medium">
                      {orderData.order.customText}
                    </span>
                  </div>
                )}

                {orderData.order.imageUrl && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Image:</span>
                    <span className="font-medium text-green-600">
                      ✓ Included
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <PriceDisplay
                  priceCAD={orderData.order.totalPrice}
                  exchangeRates={orderData.priceInCurrencies}
                />
              </div>

              <div className="mt-2 text-xs text-gray-500">
                Created:{' '}
                {new Date(orderData.order.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
