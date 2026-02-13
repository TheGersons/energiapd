export interface ITool {
  id?: string;
  name: string;
  description: string;
  brand: string;
  model: string;
  serial: string;
  image: string;
  available: boolean;
  code: string;
  createdAt?: Date;
  updatedAt?: Date;
  status: boolean;
}
