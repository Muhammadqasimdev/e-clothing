export interface Order {
  id: string;
  productType: 'tshirt' | 'sweater';
  material?: 'light-cotton' | 'heavy-cotton'; // Only for t-shirts
  color: 'black' | 'white' | 'green' | 'red' | 'pink' | 'yellow';
  customText?: string;
  imageUrl?: string;
  basePrice: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderRequest {
  productType: 'tshirt' | 'sweater';
  material?: 'light-cotton' | 'heavy-cotton';
  color: 'black' | 'white' | 'green' | 'red' | 'pink' | 'yellow';
  customText?: string;
  imageUrl?: string;
}

export interface UpdateOrderRequest {
  material?: 'light-cotton' | 'heavy-cotton';
  color?: 'black' | 'white' | 'green' | 'red' | 'pink' | 'yellow';
  customText?: string;
  imageUrl?: string;
}

export interface ExchangeRates {
  CAD: number;
  USD: number;
  EUR: number;
}

export interface PriceInCurrencies {
  CAD: number;
  USD: number;
  EUR: number;
}
