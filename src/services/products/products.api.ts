import { api } from '../api/client';
import { Product, ProductListResponse } from './products.types';

export const getProducts = async (): Promise<ProductListResponse> => {
  const { data } = await api.get<ProductListResponse>('/products');

  return data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const { data } = await api.get<Product>(`/products/${id}`);

  return data;
};
