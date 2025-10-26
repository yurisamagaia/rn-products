import MockAdapter from 'axios-mock-adapter';

import { api } from '../../api/client';
import { getProductById, getProducts } from '../products.api';

const mock = new MockAdapter(api);

afterEach(() => {
  mock.reset();
});

describe('products.api', () => {
  it('fetches product list', async () => {
    const response = {
      products: [],
      total: 0,
      skip: 0,
      limit: 30,
    };

    mock.onGet('/products').reply(200, response);

    await expect(getProducts()).resolves.toEqual(response);
  });

  it('fetches product detail', async () => {
    const product = {
      id: 1,
      title: 'Sample',
      description: 'Sample product',
      price: 10,
      discountPercentage: 0,
      rating: 4,
      stock: 10,
      brand: 'Brand',
      category: 'category',
      thumbnail: 'https://example.com',
      images: [],
    };

    mock.onGet('/products/1').reply(200, product);

    await expect(getProductById(1)).resolves.toEqual(product);
  });
});
