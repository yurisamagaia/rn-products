export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode?: string;
  qrCode?: string;
}

export type Review = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  tags?: string[];
  sku?: string;
  weight?: number;
  dimensions?: Dimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: 'In Stock' | 'Out of Stock' | string;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: ProductMeta;

  reviews: Review[];
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}