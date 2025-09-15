import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ProductCustomizer } from '../ProductCustomizer';
import { ApiService } from '../../services/api.service';

vi.mock('../../services/api.service');
const MockedApiService = ApiService as any;

vi.mock('react-dropzone', () => ({
  useDropzone: () => ({
    getRootProps: () => ({}),
    getInputProps: () => ({}),
    isDragActive: false,
  }),
}));

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

describe('ProductCustomizer', () => {
  const mockExchangeRates = {
    CAD: 1.0,
    USD: 0.74,
    EUR: 0.68,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    MockedApiService.getExchangeRates.mockResolvedValue(mockExchangeRates);
  });

  it('should render the component with default values', async () => {
    render(<ProductCustomizer />);

    expect(screen.getByText('Customize Your T-Shirt')).toBeInTheDocument();
    expect(screen.getByTestId('custom-text-input')).toBeInTheDocument(); // customText input
    expect(screen.getByText('T-Shirt')).toBeInTheDocument();
    expect(screen.getByText('Sweater')).toBeInTheDocument();
  });

  it('should switch between t-shirt and sweater', async () => {
    const user = userEvent.setup();
    render(<ProductCustomizer />);

    // Initially t-shirt is selected
    expect(screen.getByText('Customize Your T-Shirt')).toBeInTheDocument();

    // Click sweater button
    await user.click(screen.getByText('Sweater'));
    expect(screen.getByText('Customize Your Sweater')).toBeInTheDocument();

    // Click t-shirt button
    await user.click(screen.getByText('T-Shirt'));
    expect(screen.getByText('Customize Your T-Shirt')).toBeInTheDocument();
  });

  it('should show material selection for t-shirt only', async () => {
    const user = userEvent.setup();
    render(<ProductCustomizer />);

    // T-shirt should show material options
    expect(screen.getByText('Light Cotton')).toBeInTheDocument();
    expect(screen.getByText('Heavy Cotton (+$3)')).toBeInTheDocument();

    // Switch to sweater
    await user.click(screen.getByText('Sweater'));

    // Material options should not be visible
    expect(screen.queryByText('Light Cotton')).not.toBeInTheDocument();
    expect(screen.queryByText('Heavy Cotton (+$3)')).not.toBeInTheDocument();
  });

  it('should show custom text input for t-shirt only', async () => {
    const user = userEvent.setup();
    render(<ProductCustomizer />);

    // T-shirt should show custom text input
    expect(screen.getByText('Custom Text (First 8 characters free, then +$5)')).toBeInTheDocument();

    // Switch to sweater
    await user.click(screen.getByText('Sweater'));

    // Custom text input should not be visible
    expect(screen.queryByText('Custom Text (First 8 characters free, then +$5)')).not.toBeInTheDocument();
  });

  it('should update custom text and show character count', async () => {
    const user = userEvent.setup();
    render(<ProductCustomizer />);

    const textInput = screen.getByPlaceholderText('Enter your custom text...');
    
    await user.type(textInput, 'Hello World');
    
    expect(textInput).toHaveValue('Hello World');
    expect(screen.getByText('11/16 characters')).toBeInTheDocument();
    expect(screen.getByText('+$5 for text over 8 characters')).toBeInTheDocument();
  });

  it('should show correct color options for t-shirt', () => {
    render(<ProductCustomizer />);

    expect(screen.getByText('Black ($16.95)')).toBeInTheDocument();
    expect(screen.getByText('White ($16.95)')).toBeInTheDocument();
    expect(screen.getByText('Green ($18.95)')).toBeInTheDocument();
    expect(screen.getByText('Red ($18.95)')).toBeInTheDocument();
  });

  it('should show correct color options for sweater', async () => {
    const user = userEvent.setup();
    render(<ProductCustomizer />);

    await user.click(screen.getByText('Sweater'));

    expect(screen.getByText('Black ($28.95)')).toBeInTheDocument();
    expect(screen.getByText('White ($28.95)')).toBeInTheDocument();
    expect(screen.getByText('Pink ($32.95)')).toBeInTheDocument();
    expect(screen.getByText('Yellow ($32.95)')).toBeInTheDocument();
  });

  it('should calculate price correctly', async () => {
    const user = userEvent.setup();
    render(<ProductCustomizer />);

    // Base price for black t-shirt with light cotton
    expect(screen.getByTestId('total-price')).toHaveTextContent('$16.95 CAD');

    // Switch to heavy cotton
    await user.click(screen.getByText('Heavy Cotton (+$3)'));
    expect(screen.getByTestId('total-price')).toHaveTextContent('$19.95 CAD');

    // Add long text
    const textInput = screen.getByPlaceholderText('Enter your custom text...');
    await user.type(textInput, 'This is a very long text');
    expect(screen.getByTestId('total-price')).toHaveTextContent('$24.95 CAD'); // 19.95 + 5
  });

  it('should create an order successfully', async () => {
    const user = userEvent.setup();
    const mockOrder = {
      order: {
        id: 'test-id',
        productType: 'tshirt',
        material: 'light-cotton',
        color: 'black',
        customText: 'Test',
        basePrice: 16.95,
        totalPrice: 21.95,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      priceInCurrencies: {
        CAD: 21.95,
        USD: 16.24,
        EUR: 14.93,
      },
    };

    MockedApiService.createOrder.mockResolvedValue(mockOrder);

    render(<ProductCustomizer />);

    const textInput = screen.getByPlaceholderText('Enter your custom text...');
    await user.type(textInput, 'Test');

    const saveButton = screen.getByText('Save Order');
    await user.click(saveButton);

    await waitFor(() => {
      expect(MockedApiService.createOrder).toHaveBeenCalledWith({
        productType: 'tshirt',
        material: 'light-cotton',
        color: 'black',
        customText: 'Test',
        imageUrl: undefined,
      });
    });

    expect(screen.getByText('Update Order')).toBeInTheDocument();
  });

  it('should handle order creation error', async () => {
    const user = userEvent.setup();
    MockedApiService.createOrder.mockRejectedValue(new Error('API Error'));

    render(<ProductCustomizer />);

    const saveButton = screen.getByText('Save Order');
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to save order. Please try again.')).toBeInTheDocument();
    });
  });

  it('should update an existing order', async () => {
    const user = userEvent.setup();
    const mockOrder = {
      order: {
        id: 'test-id',
        productType: 'tshirt',
        material: 'light-cotton',
        color: 'black',
        customText: 'Test',
        basePrice: 16.95,
        totalPrice: 21.95,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      priceInCurrencies: {
        CAD: 21.95,
        USD: 16.24,
        EUR: 14.93,
      },
    };

    MockedApiService.createOrder.mockResolvedValue(mockOrder);
    MockedApiService.updateOrder.mockResolvedValue({
      ...mockOrder,
      order: { ...mockOrder.order, color: 'white' },
    });

    render(<ProductCustomizer />);

    // Create initial order
    const textInput = screen.getByPlaceholderText('Enter your custom text...');
    await user.type(textInput, 'Test');

    const saveButton = screen.getByText('Save Order');
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Update Order')).toBeInTheDocument();
    });

    // Update order
    await user.click(screen.getByText('White ($16.95)'));
    await user.click(screen.getByText('Update Order'));

    await waitFor(() => {
      expect(MockedApiService.updateOrder).toHaveBeenCalledWith('test-id', {
        material: 'light-cotton',
        color: 'white',
        customText: 'Test',
        imageUrl: undefined,
      });
    });
  });

  it('should handle image upload', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockUploadResponse = {
      success: true,
      imageUrl: '/uploads/test.jpg',
      filename: 'test.jpg',
    };

    MockedApiService.uploadImage.mockResolvedValue(mockUploadResponse);

    render(<ProductCustomizer />);

    const fileInput = screen.getByTestId('file-input');
    
    // Simulate file change event
    fireEvent.change(fileInput, {
      target: { files: [mockFile] }
    });

    await waitFor(() => {
      expect(MockedApiService.uploadImage).toHaveBeenCalledWith(mockFile);
    });
  });

  it('should handle exchange rates loading error', async () => {
    MockedApiService.getExchangeRates.mockRejectedValue(new Error('API Error'));

    render(<ProductCustomizer />);

    // Should still render the component even if exchange rates fail
    expect(screen.getByText('Customize Your T-Shirt')).toBeInTheDocument();
  });

  it('should prevent invalid color combinations', async () => {
    const user = userEvent.setup();
    render(<ProductCustomizer />);

    // Switch to sweater first to see pink color
    await user.click(screen.getByText('Sweater'));
    expect(screen.getByText('Pink ($32.95)')).toBeInTheDocument();
    
    // Switch back to t-shirt - pink should not be available
    await user.click(screen.getByText('T-Shirt'));
    expect(screen.queryByText('Pink ($32.95)')).not.toBeInTheDocument();
    
    // Black should be selected by default
    expect(screen.getByText('Black ($16.95)')).toHaveClass('bg-blue-600');
  });
});
