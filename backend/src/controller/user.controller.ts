import { Request, Response } from "express";
import { userRepository } from "repository/user.repository";

class UserController {
  async findAll(req: Request, res: Response) {
    userRepository
      .findAll()
      .then((rs) => res.status(200).json(rs))
      .catch((error) => {
        res.status(400).json(error);
      });
  }

  async findOne({ query }: Request, res: Response) {
    if (!query || Object.keys(query).length === 0) {
      res.json({});
      return;
    }
    userRepository
      .findOne(query)
      .then((rs) => res.status(200).json(rs))
      .catch((error) => res.status(500).json(error));
  }

  async create(req: Request, res: Response) {
    userRepository
      .create(req.body.user)
      .then((rs) => res.status(200).json(rs))
      .catch((error) => {
        console.log(error);
        res.status(500).json(error);
      });
  }

  async update({ body }: Request, res: Response) {
    userRepository
      .update(body.user)
      .then((rs) => res.status(200).json(rs))
      .catch((e) => {
        console.log(e);
        res.status(500).json(e);
      });
  }

  async activeCount(req: Request, res: Response) {
    userRepository
      .activeCount()
      .then((rs) => res.status(200).json(rs))
      .catch((e) => res.status(500).json(e));
  }
  async inactiveCount(req: Request, res: Response) {
    userRepository
      .inactiveCount()
      .then((rs) => res.status(200).json(rs))
      .catch((e) => res.status(500).json(e));
  }
  async totalCount(req: Request, res: Response) {
    userRepository
      .totalCount()
      .then((rs) => res.status(200).json(rs))
      .catch((e) => res.status(500).json(e));
  }
}

export const userController = new UserController();
