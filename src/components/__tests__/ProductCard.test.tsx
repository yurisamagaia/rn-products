import { fireEvent, render, screen } from '@testing-library/react-native';

import { ProductCard } from '../ProductCard';
import type { Product } from '../../services/products';

const product: Product = {
  id: 1,
  title: 'Essence Mascara Lash Princess',
  description: 'A mascara with long-lasting effects.',
  price: 9.99,
  discountPercentage: 10.48,
  rating: 2.56,
  stock: 99,
  brand: 'Essence',
  category: 'beauty',
  thumbnail: 'https://cdn.dummyjson.com/product-images/beauty/essence-mascara.jpg',
  images: ['https://cdn.dummyjson.com/product-images/beauty/essence-mascara.jpg'],
};

describe('ProductCard', () => {
  it('renders basic product information', () => {
    render(<ProductCard product={product} />);

    expect(screen.getByText(product.title)).toBeTruthy();
    expect(screen.getByText(product.brand)).toBeTruthy();
    expect(screen.getByText(/R\$\s*9,99/)).toBeTruthy();
    expect(screen.getByText(product.rating.toFixed(1))).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const handlePress = jest.fn();

    render(<ProductCard product={product} onPress={handlePress} />);

    fireEvent.press(screen.getByRole('button'));

    expect(handlePress).toHaveBeenCalledTimes(1);
  });
});
