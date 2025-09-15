import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { OrderHistory } from '../OrderHistory';
import { ApiService } from '../../services/api.service';

// Mock the ApiService
vi.mock('../../services/api.service');
const MockedApiService = ApiService as any;

// Mock the ProductPreview component
vi.mock('../ProductPreview', () => ({
  ProductPreview: ({ productType, color, customText, imageUrl }: any) => (
    <div data-testid="product-preview">
      {productType} - {color} - {customText} - {imageUrl || 'no-image'}
    </div>
  ),
}));

// Mock the PriceDisplay component
vi.mock('../PriceDisplay', () => ({
  PriceDisplay: ({ priceCAD, exchangeRates }: any) => (
    <div data-testid="price-display">
      CAD: {priceCAD} - USD: {priceCAD * exchangeRates.USD} - EUR: {priceCAD * exchangeRates.EUR}
    </div>
  ),
}));

describe('OrderHistory', () => {
  const mockOrders = [
    {
      order: {
        id: 'order-1',
        productType: 'tshirt',
        material: 'light-cotton',
        color: 'black',
        customText: 'Test Text',
        imageUrl: '/uploads/test.jpg',
        basePrice: 16.95,
        totalPrice: 31.95,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      priceInCurrencies: {
        CAD: 1.0,
        USD: 0.74,
        EUR: 0.68,
      },
    },
    {
      order: {
        id: 'order-2',
        productType: 'sweater',
        color: 'pink',
        customText: 'Sweater Text',
        basePrice: 32.95,
        totalPrice: 37.95,
        createdAt: '2023-01-02T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
      },
      priceInCurrencies: {
        CAD: 1.0,
        USD: 0.74,
        EUR: 0.68,
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', () => {
    MockedApiService.getAllOrders.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<OrderHistory />);

    expect(screen.getByText('Order History')).toBeInTheDocument();
    expect(screen.getByText('Loading orders...')).toBeInTheDocument();
  });

  it('should display orders when loaded successfully', async () => {
    MockedApiService.getAllOrders.mockResolvedValue(mockOrders);

    render(<OrderHistory />);

    await waitFor(() => {
      expect(screen.getByText('Order History')).toBeInTheDocument();
    });

    expect(screen.getByText('T-Shirt')).toBeInTheDocument();
    expect(screen.getByText('Sweater')).toBeInTheDocument();
    expect(screen.getByText('Test Text')).toBeInTheDocument();
    expect(screen.getByText('Sweater Text')).toBeInTheDocument();
    expect(screen.getByText('black')).toBeInTheDocument();
    expect(screen.getByText('pink')).toBeInTheDocument();
    expect(screen.getByText('light cotton')).toBeInTheDocument();
    expect(screen.getByText('✓ Included')).toBeInTheDocument();
  });

  it('should show empty state when no orders exist', async () => {
    MockedApiService.getAllOrders.mockResolvedValue([]);

    render(<OrderHistory />);

    await waitFor(() => {
      expect(screen.getByText('No orders found. Create your first order!')).toBeInTheDocument();
    });
  });

  it('should handle loading error', async () => {
    MockedApiService.getAllOrders.mockRejectedValue(new Error('API Error'));

    render(<OrderHistory />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load orders')).toBeInTheDocument();
    });
  });

  it('should delete an order successfully', async () => {
    const user = userEvent.setup();
    MockedApiService.getAllOrders.mockResolvedValue(mockOrders);
    MockedApiService.deleteOrder.mockResolvedValue(undefined);

    render(<OrderHistory />);

    await waitFor(() => {
      expect(screen.getByText('T-Shirt')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(MockedApiService.deleteOrder).toHaveBeenCalledWith('order-1');
    });

    // Order should be removed from the list
    expect(screen.queryByText('Test Text')).not.toBeInTheDocument();
    expect(screen.getByText('Sweater Text')).toBeInTheDocument();
  });

  it('should handle delete error', async () => {
    const user = userEvent.setup();
    MockedApiService.getAllOrders.mockResolvedValue(mockOrders);
    MockedApiService.deleteOrder.mockRejectedValue(new Error('Delete failed'));

    render(<OrderHistory />);

    await waitFor(() => {
      expect(screen.getByText('T-Shirt')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Failed to delete order')).toBeInTheDocument();
    });

    expect(screen.getByText('Failed to delete order')).toBeInTheDocument();
  });

  it('should display order details correctly', async () => {
    MockedApiService.getAllOrders.mockResolvedValue(mockOrders);

    render(<OrderHistory />);

    await waitFor(() => {
      expect(screen.getByText('T-Shirt')).toBeInTheDocument();
    });

    // Check first order details
    expect(screen.getAllByText('Color:')).toHaveLength(2);
    expect(screen.getByText('black')).toBeInTheDocument();
    expect(screen.getAllByText('Material:')).toHaveLength(1);
    expect(screen.getByText('light cotton')).toBeInTheDocument();
    expect(screen.getAllByText('Text:')).toHaveLength(2);
    expect(screen.getByText('Test Text')).toBeInTheDocument();
    expect(screen.getAllByText('Image:')).toHaveLength(1);
    expect(screen.getByText('✓ Included')).toBeInTheDocument();

    expect(screen.getByText('pink')).toBeInTheDocument();
    expect(screen.getByText('Sweater Text')).toBeInTheDocument();
    expect(screen.getAllByText('Material:')).toHaveLength(1);
  });

  it('should format dates correctly', async () => {
    MockedApiService.getAllOrders.mockResolvedValue(mockOrders);

    render(<OrderHistory />);

    await waitFor(() => {
      expect(screen.getByText('Created: 1/1/2023')).toBeInTheDocument();
    });
  });

  it('should show product previews', async () => {
    MockedApiService.getAllOrders.mockResolvedValue(mockOrders);

    render(<OrderHistory />);

    await waitFor(() => {
      const previews = screen.getAllByTestId('product-preview');
      expect(previews).toHaveLength(2);
      expect(previews[0]).toHaveTextContent('tshirt - black - Test Text - /uploads/test.jpg');
      expect(previews[1]).toHaveTextContent('sweater - pink - Sweater Text - no-image');
    });
  });

  it('should show price displays', async () => {
    MockedApiService.getAllOrders.mockResolvedValue(mockOrders);

    render(<OrderHistory />);

    await waitFor(() => {
      const priceDisplays = screen.getAllByTestId('price-display');
      expect(priceDisplays).toHaveLength(2);
      expect(priceDisplays[0]).toHaveTextContent(/CAD: 31\.95 - USD: 23\.64\d* - EUR: 21\.72\d*/);
      expect(priceDisplays[1]).toHaveTextContent(/CAD: 37\.95 - USD: 28\.08\d* - EUR: 25\.80\d*/);
    });
  });
});
