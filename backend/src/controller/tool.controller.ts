import { Request, Response } from "express";
import { toolRepository } from "repository/tool.repository";

class ToolController {
  findAll({ body }: Request, res: Response) {
    toolRepository
      .findAll()
      .then((rs) => res.status(200).json(rs))
      .catch((error) => res.status(500).json(error));
  }

  findOne({ query }: Request, res: Response) {
    if (!query || Object.keys(query).length === 0) {
      res.json({});
      return;
    }
    toolRepository
      .findOne(query)
      .then((rs) => res.status(200).json(rs))
      .catch((error) => res.status(500).json(error));
  }

  update({ body }: Request, res: Response) {
    toolRepository
      .update(body.tool)
      .then((rs) => res.status(200).json(rs))
      .catch((error) => res.status(500).json(error));
  }

  create({ body }: Request, res: Response) {
    toolRepository
      .create(body.tool)
      .then((rs) => {
        const credentials = Buffer.from(
          `${process.env.NEXTCLOUD_USERNAME}:${process.env.NEXTCLOUD_PASSWORD}`,
        ).toString("base64");
         `Basic ${credentials}`;

         
        res.status(200).json(rs);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json(error);
      });
  }
}

export const toolController = new ToolController();
