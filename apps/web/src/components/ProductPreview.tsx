import React from 'react';

interface ProductPreviewProps {
  productType: 'tshirt' | 'sweater';
  color: 'black' | 'white' | 'green' | 'red' | 'pink' | 'yellow';
  customText?: string;
  imageUrl?: string | null;
}

export const ProductPreview: React.FC<ProductPreviewProps> = ({
  productType,
  color,
  customText,
  imageUrl,
}) => {
  const getColorClass = (color: string) => {
    const colorMap = {
      black: 'bg-gray-900',
      white: 'bg-white border-2 border-gray-300',
      green: 'bg-green-600',
      red: 'bg-red-600',
      pink: 'bg-pink-400',
      yellow: 'bg-yellow-400',
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-900';
  };

  const getTextColor = (color: string) => {
    return color === 'white' ? 'text-gray-900' : 'text-white';
  };

  return (
    <div className="w-80 h-96 relative">
      {/* Hanger/Display Frame */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full border-4 border-gray-400"></div>
        <div className="w-1 h-4 bg-gray-400 mx-auto"></div>
      </div>

      {/* Product Base */}
      <div
        className={`w-full h-full rounded-lg ${getColorClass(color)} relative overflow-hidden shadow-lg`}
        style={{
          background: `linear-gradient(135deg, ${
            getColorClass(color).includes('bg-gray-900')
              ? '#1f2937'
              : getColorClass(color).includes('bg-white')
                ? '#ffffff'
                : getColorClass(color).includes('bg-green')
                  ? '#16a34a'
                  : getColorClass(color).includes('bg-red')
                    ? '#dc2626'
                    : getColorClass(color).includes('bg-pink')
                      ? '#ec4899'
                      : getColorClass(color).includes('bg-yellow')
                        ? '#eab308'
                        : '#1f2937'
          }, 
            ${
              getColorClass(color).includes('bg-gray-900')
                ? '#111827'
                : getColorClass(color).includes('bg-white')
                  ? '#f9fafb'
                  : getColorClass(color).includes('bg-green')
                    ? '#15803d'
                    : getColorClass(color).includes('bg-red')
                      ? '#b91c1c'
                      : getColorClass(color).includes('bg-pink')
                        ? '#db2777'
                        : getColorClass(color).includes('bg-yellow')
                          ? '#ca8a04'
                          : '#111827'
            })`,
        }}
      >
        {/* Product Shape */}
        <div className="absolute inset-6">
          {/* Neckline */}
          <div className="w-20 h-10 mx-auto bg-gray-200 rounded-t-full shadow-inner"></div>

          {/* Body */}
          <div className="w-full h-60 mt-6 bg-current rounded-lg shadow-inner"></div>

          {/* Sleeves for T-shirt */}
          {productType === 'tshirt' && (
            <>
              <div className="absolute top-16 -left-6 w-12 h-24 bg-current rounded-full shadow-lg"></div>
              <div className="absolute top-16 -right-6 w-12 h-24 bg-current rounded-full shadow-lg"></div>
            </>
          )}

          {/* Sweater texture/pattern */}
          {productType === 'sweater' && (
            <>
              <div className="absolute top-20 left-4 right-4 h-1 bg-gray-300 opacity-30"></div>
              <div className="absolute top-28 left-4 right-4 h-1 bg-gray-300 opacity-30"></div>
              <div className="absolute top-36 left-4 right-4 h-1 bg-gray-300 opacity-30"></div>
              <div className="absolute top-44 left-4 right-4 h-1 bg-gray-300 opacity-30"></div>
            </>
          )}
        </div>

        {/* Custom Text */}
        {customText && productType === 'tshirt' && !imageUrl && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div
              className={`text-center font-bold text-lg ${getTextColor(color)} drop-shadow-lg`}
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
            >
              {customText}
            </div>
          </div>
        )}

        {/* Custom Image */}
        {imageUrl && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <img
                src={`http://localhost:3000${imageUrl}`}
                alt="Custom design"
                className="w-28 h-28 object-cover rounded-lg shadow-lg border-2 border-white"
              />
              {/* Image frame effect */}
              <div className="absolute inset-0 rounded-lg border-2 border-gray-300 pointer-events-none"></div>
            </div>
          </div>
        )}

        {/* Custom Text (when image is present, show text below image) */}
        {customText && productType === 'tshirt' && imageUrl && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-16">
            <div
              className={`text-center font-bold text-sm ${getTextColor(color)} drop-shadow-lg`}
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              {customText}
            </div>
          </div>
        )}

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div
            className={`text-xs font-medium ${getTextColor(color)} bg-black bg-opacity-30 px-3 py-1 rounded-full backdrop-blur-sm`}
          >
            {productType === 'tshirt' ? 'T-Shirt' : 'Sweater'} -{' '}
            {color.charAt(0).toUpperCase() + color.slice(1)}
          </div>
        </div>
      </div>

      {/* Preview Label */}
      <div className="text-center mt-6">
        <h3 className="text-lg font-medium text-gray-900">Preview</h3>
        <p className="text-sm text-gray-600">
          {productType === 'tshirt' ? 'T-Shirt' : 'Sweater'} in {color}
        </p>
      </div>
    </div>
  );
};
