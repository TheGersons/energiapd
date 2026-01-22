export interface IProduct {
  id: number;
  sku: string;
  name: string;
  basePrice: number;
  category: number;
  brand: string;
  shortDescription: string;
  variants: boolean;
  publicMarket: boolean;
}
