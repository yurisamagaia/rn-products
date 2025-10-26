import { fireEvent, render, screen } from '@testing-library/react-native';

import { ProductListScreen } from '../ProductListScreen';
import type { RootStackParamList } from '../../navigation/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  useProductsQuery,
  type Product,
  type ProductListResponse,
} from '../../services/products';

jest.mock('../../services/products', () => {
  const actual = jest.requireActual('../../services/products');

  return {
    ...actual,
    useProductsQuery: jest.fn(),
  };
});

const navigationMock = {
  navigate: jest.fn(),
} as unknown as NativeStackScreenProps<RootStackParamList, 'ProductList'>['navigation'];

const routeMock = {
  key: 'ProductList-key',
  name: 'ProductList',
} as NativeStackScreenProps<RootStackParamList, 'ProductList'>['route'];

const baseQueryResult = {
  data: undefined,
  isLoading: false,
  isError: false,
  refetch: jest.fn(),
  isRefetching: false,
};

const mockUseProductsQuery = useProductsQuery as jest.MockedFunction<typeof useProductsQuery>;

const sampleProduct: Product = {
  id: 1,
  title: 'Sample Product',
  description: 'Sample description',
  price: 100,
  discountPercentage: 5,
  rating: 4.5,
  stock: 20,
  brand: 'Sample Brand',
  category: 'beauty',
  thumbnail: 'https://example.com/image.png',
  images: ['https://example.com/image.png'],
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('ProductListScreen', () => {
  it('shows loading indicator while fetching', () => {
    mockUseProductsQuery.mockReturnValue({
      ...baseQueryResult,
      isLoading: true,
    });

    render(
      <ProductListScreen navigation={navigationMock} route={routeMock} />,
    );

    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders products and navigates on press', () => {
    const productsResponse: ProductListResponse = {
      products: [sampleProduct],
      total: 1,
      skip: 0,
      limit: 10,
    };

    mockUseProductsQuery.mockReturnValue({
      ...baseQueryResult,
      data: productsResponse,
    });

    render(
      <ProductListScreen navigation={navigationMock} route={routeMock} />,
    );

    expect(screen.getByText(sampleProduct.title)).toBeTruthy();

    fireEvent.press(screen.getByRole('button'));

    expect(navigationMock.navigate).toHaveBeenCalledWith('ProductDetails', {
      productId: sampleProduct.id,
    });
  });

  it('shows error state and triggers refetch', () => {
    const refetch = jest.fn();

    mockUseProductsQuery.mockReturnValue({
      ...baseQueryResult,
      isError: true,
      refetch,
    });

    render(
      <ProductListScreen navigation={navigationMock} route={routeMock} />,
    );

    fireEvent.press(screen.getByText('Tentar novamente'));

    expect(refetch).toHaveBeenCalled();
  });
});
