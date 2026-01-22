import { Request, Response } from "express";
import { userRepository } from "repository/user.repository";

class UserController {
  async findAll(req: Request, res: Response) {
    userRepository
      .findAll()
      .then((rs) => res.status(200).json(rs))
      .catch((error) => {
        console.log(error);
        res.status(400).json(error);
      });
  }

  async create(req: Request, res: Response) {
    userRepository
      .create(req.body.user)
      .then((rs) => res.status(200).json(rs))
      .catch((error) => res.status(400).json(error));
  }
}

export const userController = new UserController();
