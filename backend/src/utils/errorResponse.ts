import { Response } from "express";

export const errorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  details?: unknown,
) => {
  const body: Record<string, unknown> = { message, statusCode };
  if (details && process.env.NODE_ENV !== "production") {
    body["details"] = details;
  }
  res.status(statusCode).json(body);
};
