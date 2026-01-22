import { Request, Response } from "express";
import { moduleRepository } from "repository/module.repository";

class ModuleController {
  async findAllWithPages(req: Request, res: Response) {
    await moduleRepository
      .findAllWithPages()
      .then((rs) => res.status(200).json(rs))
      .catch((error) => {
        console.log(error);
        res.status(500).json(error);
      });
  }

  create({ body }: Request, res: Response) {
    moduleRepository
      .create(body.module)
      .then((rs) => res.status(200).json(rs))
      .catch((error) =>
        res.status(500).json({ statusCode: 500, message: error })
      );
  }

  update({ body }: Request, res: Response) {
    moduleRepository
      .update(body.module)
      .then((rs) => res.status(200).json(rs))
      .catch((error) =>
        res.status(500).json({ statusCode: 500, message: error })
      );
  }

  delete({ query }: Request, res: Response) {
    moduleRepository
      .delete(query.id as string)
      .then((rs) => res.status(200).json(rs))
      .catch((error) =>
        res.status(500).json({ statusCode: 500, message: error })
      );
  }
}

export const moduleController = new ModuleController();
