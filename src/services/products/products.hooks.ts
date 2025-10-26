import { useQuery } from '@tanstack/react-query';

import { getProductById, getProducts } from './products.api';
import { productKeys } from './products.keys';
import { Product, ProductListResponse } from './products.types';

export const useProductsQuery = () =>
  useQuery<ProductListResponse>({
    queryKey: productKeys.list(),
    queryFn: getProducts,
  });

export const useProductQuery = (id?: number) =>
  useQuery<Product>({
    queryKey: id != null ? productKeys.detail(id) : productKeys.details(),
    queryFn: () => {
      if (id == null) {
        throw new Error('Product id is required to fetch product detail');
      }

      return getProductById(id);
    },
    enabled: id != null,
  });
