import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ApiService } from '../services/api.service';
import {
  CreateOrderRequest,
  OrderWithPrices,
  ExchangeRates,
} from '../types/order.types';
import { ProductPreview } from './ProductPreview';
import { PriceDisplay } from './PriceDisplay';

export const ProductCustomizer: React.FC = () => {
  const [productType, setProductType] = useState<'tshirt' | 'sweater'>(
    'tshirt'
  );
  const [material, setMaterial] = useState<'light-cotton' | 'heavy-cotton'>(
    'light-cotton'
  );
  const [color, setColor] = useState<
    'black' | 'white' | 'green' | 'red' | 'pink' | 'yellow'
  >('black');
  const [customText, setCustomText] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = useState<OrderWithPrices | null>(
    null
  );
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExchangeRates = async () => {
      try {
        const rates = await ApiService.getExchangeRates();
        setExchangeRates(rates);
      } catch (err) {
        console.error('Failed to load exchange rates:', err);
      }
    };
    loadExchangeRates();
  }, []);

  useEffect(() => {
    if (productType === 'tshirt') {
      if (color === 'pink' || color === 'yellow') {
        setColor('black');
      }
    } else if (productType === 'sweater') {
      if (color === 'green' || color === 'red') {
        setColor('black');
      }
    }
  }, [productType, color]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    await handleFileUpload(file);
  };

  const handleFileUpload = async (file: File) => {
    setIsUploadingImage(true);
    setError(null);

    try {
      const response = await ApiService.uploadImage(file);
      setImageUrl(response.imageUrl);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const handleSaveOrder = async () => {
    if (!exchangeRates) {
      setError('Exchange rates not loaded. Please try again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const orderData: CreateOrderRequest = {
        productType,
        material: productType === 'tshirt' ? material : undefined,
        color,
        customText: customText.trim() || undefined,
        imageUrl: imageUrl || undefined,
      };

      const order = await ApiService.createOrder(orderData);
      setCurrentOrder(order);
    } catch (err) {
      setError('Failed to save order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrder = async () => {
    if (!currentOrder || !exchangeRates) return;

    setIsLoading(true);
    setError(null);

    try {
      const updateData = {
        material: productType === 'tshirt' ? material : undefined,
        color,
        customText: customText.trim() || undefined,
        imageUrl: imageUrl || undefined,
      };

      const order = await ApiService.updateOrder(
        currentOrder.order.id,
        updateData
      );
      setCurrentOrder(order);
    } catch (err) {
      setError('Failed to update order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableColors = () => {
    if (productType === 'tshirt') {
      return [
        { value: 'black', label: 'Black', price: 16.95 },
        { value: 'white', label: 'White', price: 16.95 },
        { value: 'green', label: 'Green', price: 18.95 },
        { value: 'red', label: 'Red', price: 18.95 },
      ];
    } else {
      return [
        { value: 'black', label: 'Black', price: 28.95 },
        { value: 'white', label: 'White', price: 28.95 },
        { value: 'pink', label: 'Pink', price: 32.95 },
        { value: 'yellow', label: 'Yellow', price: 32.95 },
      ];
    }
  };

  const calculatePrice = () => {
    const colors = getAvailableColors();
    const selectedColor = colors.find(c => c.value === color);
    let basePrice = selectedColor?.price || 0;

    if (productType === 'tshirt' && material === 'heavy-cotton') {
      basePrice += 3;
    }

    let totalPrice = basePrice;

    if (customText && customText.length > 8) {
      totalPrice += 5;
    }

    if (imageUrl) {
      totalPrice += 10;
    }

    return { basePrice, totalPrice };
  };

  const { basePrice, totalPrice } = calculatePrice();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Customize Your {productType === 'tshirt' ? 'T-Shirt' : 'Sweater'}
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Type
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => setProductType('tshirt')}
                className={`px-4 py-2 rounded-md font-medium ${
                  productType === 'tshirt'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                T-Shirt
              </button>
              <button
                onClick={() => setProductType('sweater')}
                className={`px-4 py-2 rounded-md font-medium ${
                  productType === 'sweater'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Sweater
              </button>
            </div>
          </div>

          {/* Material Selection (T-Shirt only) */}
          {productType === 'tshirt' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setMaterial('light-cotton')}
                  className={`px-4 py-2 rounded-md font-medium ${
                    material === 'light-cotton'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Light Cotton
                </button>
                <button
                  onClick={() => setMaterial('heavy-cotton')}
                  className={`px-4 py-2 rounded-md font-medium ${
                    material === 'heavy-cotton'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Heavy Cotton (+$3)
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="grid grid-cols-2 gap-2">
              {getAvailableColors().map(colorOption => (
                <button
                  key={colorOption.value}
                  onClick={() => setColor(colorOption.value as any)}
                  className={`px-4 py-2 rounded-md font-medium text-left ${
                    color === colorOption.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {colorOption.label} (${colorOption.price.toFixed(2)})
                </button>
              ))}
            </div>
          </div>

          {/* Custom Text (T-Shirt only) */}
          {productType === 'tshirt' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Text (First 8 characters free, then +$5)
              </label>
              <input
                type="text"
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                maxLength={16}
                placeholder="Enter your custom text..."
                data-testid="custom-text-input"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-sm text-gray-500 mt-1">
                {customText.length}/16 characters
                {customText.length > 8 && (
                  <span className="text-orange-600 ml-2">
                    +$5 for text over 8 characters
                  </span>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image (+$10)
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-400 bg-blue-50'
                  : isUploadingImage
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input 
                {...getInputProps()} 
                disabled={isUploadingImage} 
                type="file" 
                data-testid="file-input"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    handleFileUpload(files[0]);
                  }
                }}
              />
              {isUploadingImage ? (
                <div>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Uploading image...</p>
                </div>
              ) : imageUrl ? (
                <div>
                  <img
                    src={`http://localhost:3000${imageUrl}`}
                    alt="Uploaded"
                    className="mx-auto h-32 w-32 object-cover rounded-md mb-2"
                    onError={e => {
                      setTimeout(() => {
                        const img = e.target as HTMLImageElement;
                        img.src = img.src;
                      }, 1000);
                    }}
                  />
                  <div className="flex flex-col items-center space-y-2">
                    <p className="text-sm text-gray-600">
                      Click or drag to replace image
                    </p>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setImageUrl(null);
                      }}
                      className="text-xs text-red-600 hover:text-red-800 underline"
                    >
                      Remove image
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600">
                    {isDragActive
                      ? 'Drop the image here...'
                      : 'Drag & drop an image here, or click to select'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Price Breakdown</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Base Price:</span>
                <span>${basePrice.toFixed(2)} CAD</span>
              </div>
              {productType === 'tshirt' && material === 'heavy-cotton' && (
                <div className="flex justify-between text-orange-600">
                  <span>Heavy Cotton:</span>
                  <span>+$3.00</span>
                </div>
              )}
              {customText && customText.length > 8 && (
                <div className="flex justify-between text-orange-600">
                  <span>Custom Text:</span>
                  <span>+$5.00</span>
                </div>
              )}
              {imageUrl && (
                <div className="flex justify-between text-orange-600">
                  <span>Image:</span>
                  <span>+$10.00</span>
                </div>
              )}
              <div className="border-t pt-1 font-medium">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span data-testid="total-price">${totalPrice.toFixed(2)} CAD</span>
                </div>
              </div>
            </div>
            {exchangeRates && (
              <PriceDisplay
                priceCAD={totalPrice}
                exchangeRates={exchangeRates}
              />
            )}
          </div>

          <div className="flex space-x-4">
            {currentOrder ? (
              <button
                onClick={handleUpdateOrder}
                disabled={isLoading}
                className="flex-1 bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Update Order'}
              </button>
            ) : (
              <button
                onClick={handleSaveOrder}
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Order'}
              </button>
            )}
          </div>
        </div>

        {/* Product Preview */}
        <div className="flex justify-center">
          <ProductPreview
            productType={productType}
            color={color}
            customText={customText}
            imageUrl={imageUrl}
          />
        </div>
      </div>
    </div>
  );
};
