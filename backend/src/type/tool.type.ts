export interface ITool {
  id: string;
  name: string;
  description: string;
  brand: string;
  model: string;
  serial: string;
  status: boolean;
  img: string;
  createdAt?: string;
  updatedAt?: string;
}
