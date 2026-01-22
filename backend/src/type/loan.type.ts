export interface ILoan {
  id?: string;
  name: string;
  dni: string;
  department: string;
  useDescription: string;
  status: number;
  useTime: Date;
  returnDate: Date;
  notes: string;
  createdAt?: Date;
  updatedAt?: Date;
}
