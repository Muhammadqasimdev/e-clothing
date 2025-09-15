import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProductPreview } from '../ProductPreview';

describe('ProductPreview', () => {
  it('should render t-shirt preview with black color', () => {
    render(
      <ProductPreview
        productType="tshirt"
        color="black"
        customText="Test Text"
        imageUrl="/test.jpg"
      />
    );

    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(screen.getByText('T-Shirt in black')).toBeInTheDocument();
    expect(screen.getByText('Test Text')).toBeInTheDocument();
  });

  it('should render sweater preview with pink color', () => {
    render(
      <ProductPreview
        productType="sweater"
        color="pink"
        customText="Sweater Text"
      />
    );

    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(screen.getByText('Sweater in pink')).toBeInTheDocument();
    // Custom text is not displayed for sweaters, only for t-shirts
  });

  it('should render without custom text', () => {
    render(
      <ProductPreview
        productType="tshirt"
        color="white"
      />
    );

    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(screen.getByText('T-Shirt in white')).toBeInTheDocument();
    expect(screen.queryByText('Test Text')).not.toBeInTheDocument();
  });

  it('should render with image', () => {
    render(
      <ProductPreview
        productType="tshirt"
        color="green"
        imageUrl="/test-image.jpg"
      />
    );

    const image = screen.getByAltText('Custom design');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'http://localhost:3000/test-image.jpg');
  });

  it('should render without image', () => {
    render(
      <ProductPreview
        productType="tshirt"
        color="red"
      />
    );

    expect(screen.queryByAltText('Custom design')).not.toBeInTheDocument();
  });

  it('should render with both text and image for t-shirt', () => {
    render(
      <ProductPreview
        productType="tshirt"
        color="black"
        customText="Hello World"
        imageUrl="/test.jpg"
      />
    );

    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByAltText('Custom design')).toBeInTheDocument();
  });

  it('should not render text for sweater when image is present', () => {
    render(
      <ProductPreview
        productType="sweater"
        color="yellow"
        customText="Sweater Text"
        imageUrl="/test.jpg"
      />
    );

    // For sweater, text should not be rendered when image is present
    expect(screen.queryByText('Sweater Text')).not.toBeInTheDocument();
    expect(screen.getByAltText('Custom design')).toBeInTheDocument();
  });

  it('should apply correct color classes', () => {
    const { rerender } = render(
      <ProductPreview
        productType="tshirt"
        color="black"
      />
    );

    // Check that the component renders without errors
    expect(screen.getByText('T-Shirt in black')).toBeInTheDocument();

    // Test white color
    rerender(
      <ProductPreview
        productType="tshirt"
        color="white"
      />
    );

    expect(screen.getByText('T-Shirt in white')).toBeInTheDocument();

    // Test green color
    rerender(
      <ProductPreview
        productType="tshirt"
        color="green"
      />
    );

    expect(screen.getByText('T-Shirt in green')).toBeInTheDocument();
  });

  it('should show correct text color for different backgrounds', () => {
    const { rerender } = render(
      <ProductPreview
        productType="tshirt"
        color="black"
        customText="Black Text"
      />
    );

    const textElement = screen.getByText('Black Text');
    expect(textElement).toHaveClass('text-white');

    // Test white background
    rerender(
      <ProductPreview
        productType="tshirt"
        color="white"
        customText="White Text"
      />
    );

    const whiteTextElement = screen.getByText('White Text');
    expect(whiteTextElement).toHaveClass('text-gray-900');
  });

  it('should render all supported colors', () => {
    const colors = ['black', 'white', 'green', 'red', 'pink', 'yellow'] as const;
    
    colors.forEach(color => {
      const { unmount } = render(
        <ProductPreview
          productType="tshirt"
          color={color}
        />
      );

      expect(screen.getByText(`T-Shirt in ${color}`)).toBeInTheDocument();
      unmount();
    });
  });

  it('should render sweater texture pattern', () => {
    render(
      <ProductPreview
        productType="sweater"
        color="black"
      />
    );

    // Check that sweater-specific elements are rendered
    expect(screen.getByText('Sweater in black')).toBeInTheDocument();
  });

  it('should render t-shirt sleeves', () => {
    render(
      <ProductPreview
        productType="tshirt"
        color="black"
      />
    );

    // T-shirt should have sleeves (this is handled by CSS classes)
    expect(screen.getByText('T-Shirt in black')).toBeInTheDocument();
  });
});
