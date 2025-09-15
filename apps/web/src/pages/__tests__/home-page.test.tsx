import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HomePage } from '../home-page';

// Mock the ProductCustomizer component
vi.mock('../../components/ProductCustomizer', () => ({
  ProductCustomizer: () => <div data-testid="product-customizer">Product Customizer</div>,
}));

describe('HomePage', () => {
  it('should render the ProductCustomizer component', () => {
    render(<HomePage />);

    expect(screen.getByTestId('product-customizer')).toBeInTheDocument();
    expect(screen.getByText('Product Customizer')).toBeInTheDocument();
  });

  it('should be a functional component', () => {
    const { container } = render(<HomePage />);
    
    // Should render without errors
    expect(container.firstChild).toBeInTheDocument();
  });
});
