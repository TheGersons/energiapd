export interface AuthRequest extends Request {
  idUser?: string;
  permissions?: string[];
}
