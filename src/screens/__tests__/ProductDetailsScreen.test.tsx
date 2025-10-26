import { fireEvent, render, screen } from '@testing-library/react-native';

import { ProductDetailsScreen } from '../ProductDetailsScreen';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import {
  useProductQuery,
  type Product,
} from '../../services/products';

jest.mock('../../services/products', () => {
  const actual = jest.requireActual('../../services/products');

  return {
    ...actual,
    useProductQuery: jest.fn(),
  };
});

const mockUseProductQuery = useProductQuery as jest.MockedFunction<typeof useProductQuery>;

const route: NativeStackScreenProps<RootStackParamList, 'ProductDetails'>['route'] = {
  key: 'ProductDetails-key',
  name: 'ProductDetails',
  params: { productId: 1 },
};

const navigation = {
  goBack: jest.fn(),
} as unknown as NativeStackScreenProps<RootStackParamList, 'ProductDetails'>['navigation'];

const baseQueryState = {
  data: undefined,
  isLoading: false,
  isError: false,
  refetch: jest.fn(),
};

const product: Product = {
  id: 1,
  title: 'Dior J\'adore',
  description: 'Luxurious fragrance.',
  price: 89.99,
  discountPercentage: 14.72,
  rating: 3.8,
  stock: 98,
  brand: 'Dior',
  category: 'fragrances',
  thumbnail: 'https://example.com/thumbnail.png',
  images: ['https://example.com/hero.png'],
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('ProductDetailsScreen', () => {
  it('renders loading indicator while fetching data', () => {
    mockUseProductQuery.mockReturnValue({
      ...baseQueryState,
      isLoading: true,
    });

    render(
      <ProductDetailsScreen navigation={navigation} route={route} />,
    );

    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders product information', () => {
    mockUseProductQuery.mockReturnValue({
      ...baseQueryState,
      data: product,
    });

    render(
      <ProductDetailsScreen navigation={navigation} route={route} />,
    );

    expect(screen.getByText(product.title)).toBeTruthy();
    expect(screen.getByText(product.brand)).toBeTruthy();
    expect(screen.getByText(/R\$\s*89,99/)).toBeTruthy();
    expect(screen.getByText('98 unidades disponíveis')).toBeTruthy();
    expect(screen.getByText('fragrances')).toBeTruthy();
    expect(screen.getByText(/14\.72% OFF/)).toBeTruthy();
  });

  it('renders error state and triggers refetch', () => {
    const refetch = jest.fn();

    mockUseProductQuery.mockReturnValue({
      ...baseQueryState,
      isError: true,
      refetch,
    });

    render(
      <ProductDetailsScreen navigation={navigation} route={route} />,
    );

    fireEvent.press(screen.getByText('Tentar novamente'));

    expect(refetch).toHaveBeenCalled();
  });
});
