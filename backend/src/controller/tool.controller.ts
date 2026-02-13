import { Request, Response } from "express";
import { toolRepository } from "repository/tool.repository";
import { v4 } from "uuid";

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

  async delete({ query }: Request, res: Response) {
    toolRepository
      .delete(query.id as string)
      .then((rs) => {
        console.log(rs);
        res.status(200).json(rs);
      })
      .catch((error) => res.status(500).json(error));
  }

  async update(req: Request, res: Response) {
    try {
      const _file = req.file as Express.Multer.File | undefined;
      console.log(!_file ? "" : req.body.image);
      const rs = await toolRepository.update({
        ...req.body,
        image: !_file ? "" : req.body.image,
        available: req.body.available === "true",
      });

      if (_file) {
        const credentials = Buffer.from(
          `${process.env.NEXTCLOUD_USERNAME}:${process.env.NEXTCLOUD_PASSWORD}`,
        ).toString("base64");

        const header = `Basic ${credentials}`;
        const response = await fetch(
          `${process.env.NEXTCLOUD_WEBDAV_URL}${req.body.id}.${_file.originalname.split(".").reverse()[0]}`,
          {
            method: "PUT",
            headers: {
              Authorization: header,
              "Content-Type": "application/octet-stream",
            },
            body: new Uint8Array(_file.buffer),
          },
        );
        if (!response.ok) {
          throw new Error("Error uploading to Nextcloud");
        }
      }
      res.status(200).json(rs);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const uuid = v4();
      const file = req.file as Express.Multer.File | undefined;
      const fileName = req.file
        ? `${uuid}.${file?.originalname.split(".").reverse()[0]}`
        : "";
      const rs = await toolRepository.create({
        ...req.body,
        id: uuid,
        image: fileName,
        available: req.body.available === "true",
      });

      if (file) {
        const credentials = Buffer.from(
          `${process.env.NEXTCLOUD_USERNAME}:${process.env.NEXTCLOUD_PASSWORD}`,
        ).toString("base64");

        const header = `Basic ${credentials}`;
        const response = await fetch(
          `${process.env.NEXTCLOUD_WEBDAV_URL}${rs.id}.${file.originalname.split(".").reverse()[0]}`,
          {
            method: "PUT",
            headers: {
              Authorization: header,
              "Content-Type": "application/octet-stream",
            },
            body: new Uint8Array(file.buffer),
          },
        );

        if (!response.ok) {
          throw new Error("Error uploading to Nextcloud");
        }
      }

      res.status(200).json(rs);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
}

export const toolController = new ToolController();
