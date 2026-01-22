import { Request, Response } from "express";
import { pageRepository } from "repository/page.repository";

class PageController {
  findAll(req: Request, res: Response) {
    pageRepository
      .findAll()
      .then((rs) => res.status(200).json(rs))
      .catch((error) =>
        res.status(500).json({ statusCode: 500, message: error })
      );
  }

  findOne({ query }: Request, res: Response) {
    pageRepository
      .findOne(query.id as string)
      .then((rs) => res.status(200).json(rs))
      .catch((error) =>
        res.status(500).json({ statusCode: 500, message: error })
      );
  }

  /**
   * Create a new page
   * Expected page: {
   * idModule
   * name
   * label
   * url
   * description
   * }
   */
  create({ body }: Request, res: Response) {
    pageRepository
      .create(body.page)
      .then((rs) => res.status(200).json(rs))
      .catch((error) =>
        res.status(500).json({ statusCode: 500, message: error })
      );
  }

  delete({ query }: Request, res: Response) {
    pageRepository
      .delete(query.id as string)
      .then((rs) => res.status(200).json(rs))
      .catch((error) =>
        res.status(500).json({ statusCode: 500, message: error })
      );
  }

  update({ body }: Request, res: Response) {
    pageRepository
      .update(body.page)
      .then((rs) => res.status(200).json(rs))
      .catch((error) =>
        res.status(500).json({ statusCode: 500, message: error })
      );
  }
}

export const pageController = new PageController();
