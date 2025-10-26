export const productKeys = {
  all: ['products'] as const,
  list: () => productKeys.all,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};
