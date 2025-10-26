import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import MockAdapter from 'axios-mock-adapter';

import { api } from '../../api/client';
import { useProductQuery, useProductsQuery } from '../products.hooks';

const mock = new MockAdapter(api);

const activeClients: QueryClient[] = [];

const createWrapper = () => {
  const queryClient = new QueryClient();
  activeClients.push(queryClient);

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return Wrapper;
};

afterEach(() => {
  mock.reset();
  activeClients.splice(0).forEach((client) => client.clear());
});

describe('products.hooks', () => {
  it('fetches products list', async () => {
    const response = {
      products: [],
      total: 0,
      skip: 0,
      limit: 30,
    };

    mock.onGet('/products').reply(200, response);

    const { result } = renderHook(() => useProductsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
    expect(result.current.data).toEqual(response);
  });

  it('fetches product by id', async () => {
    const product = {
      id: 2,
      title: 'Detail',
      description: 'desc',
      price: 20,
      discountPercentage: 1,
      rating: 4.5,
      stock: 5,
      brand: 'Brand',
      category: 'cat',
      thumbnail: 'https://example.com',
      images: [],
    };

    mock.onGet('/products/2').reply(200, product);

    const { result } = renderHook(() => useProductQuery(2), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
    expect(result.current.data).toEqual(product);
  });
});
