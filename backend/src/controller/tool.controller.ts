import { Request, Response } from "express";
import { toolRepository } from "repository/tool.repository";
import { errorResponse } from "utils/errorResponse";
import { v4 as uuidv4 } from "uuid";

class ToolController {
  private getErrorMessage = (error: unknown): string => {
    return error instanceof Error ? error.message : String(error);
  };

  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const rs = await toolRepository.findAll();
      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al obtener las herramientas.",
        this.getErrorMessage(error),
      );
    }
  };

  findAvailable = async (req: Request, res: Response): Promise<void> => {
    try {
      const rs = await toolRepository.findAvailable();
      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al obtener las herramientas",
        this.getErrorMessage(error),
      );
    }
  };

  findOne = async (req: Request, res: Response): Promise<void> => {
    try {
      const { query } = req;
      if (!query || Object.keys(query).length === 0) {
        res.status(200).json({});
        return;
      }
      const rs = await toolRepository.findOne(query);
      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al buscar la herramienta.",
        this.getErrorMessage(error),
      );
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.query;
      if (!id) {
        errorResponse(res, 400, "El ID es requerido.");
        return;
      }
      const rs = await toolRepository.delete(id as string);
      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al eliminar la herramienta.",
        this.getErrorMessage(error),
      );
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const _file = req.file as Express.Multer.File | undefined;

      const rs = await toolRepository.update({
        ...req.body,
        image: !_file ? req.body.image : req.body.image,
        available: req.body.available === "true",
      });

      if (_file) {
        await this.uploadToNextcloud(req.body.id, _file);
      }

      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al actualizar la herramienta.",
        this.getErrorMessage(error),
      );
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const uuid = uuidv4();
    const file = req.file as Express.Multer.File | undefined;
    let fileUploaded = false;
    let fileName = "";
    let publicPreviewUrl = "";

    try {
      if (file) {
        const extension = file.originalname.split(".").pop();
        fileName = `${uuid}.${extension}`;

        await this.uploadToNextcloud(fileName, file);
        fileUploaded = true;

        publicPreviewUrl = await this.getNextcloudShareUrl(fileName);
      }

      const rs = await toolRepository.create({
        ...req.body,
        id: uuid,
        image: publicPreviewUrl,
        available: req.body.available === "true",
      });

      res.status(201).json(rs);
    } catch (error: any) {
      if (fileUploaded && fileName) {
        await this.deleteFromNextcloud(fileName);
      }
      errorResponse(res, 500, "No se pudo crear la herramienta", error.message);
    }
  };

  private async uploadToNextcloud(fileName: string, file: Express.Multer.File) {
    const credentials = Buffer.from(
      `${process.env.NEXTCLOUD_USERNAME}:${process.env.NEXTCLOUD_PASSWORD}`,
    ).toString("base64");
    const response = await fetch(
      `${process.env.NEXTCLOUD_WEBDAV_URL}${fileName}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/octet-stream",
        },
        body: new Uint8Array(file.buffer),
      },
    );

    if (!response.ok) throw new Error("Error al subir archivo a Nextcloud");
  }

  private async getNextcloudShareUrl(fileName: string): Promise<string> {
    const credentials = Buffer.from(
      `${process.env.NEXTCLOUD_USERNAME}:${process.env.NEXTCLOUD_PASSWORD}`,
    ).toString("base64");
    const shareResponse = await fetch(
      `${process.env.NEXTCLOUD_BASEURL}/ocs/v1.php/apps/files_sharing/api/v1/shares?format=json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "OCS-APIRequest": "true",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          path: `/Aplicativos/Herramientas/${fileName}`,
          shareType: "3",
        }),
      },
    );

    const shareData = await shareResponse.json();
    if (shareData.ocs?.data?.token) {
      const { token, file_source: fileId } = shareData.ocs.data;
      return `${process.env.NEXTCLOUD_BASEURL}/apps/files_sharing/publicpreview/${token}?file=/&fileId=${fileId}`;
    }
    return "";
  }

  private async deleteFromNextcloud(fileName: string) {
    try {
      const credentials = Buffer.from(
        `${process.env.NEXTCLOUD_USERNAME}:${process.env.NEXTCLOUD_PASSWORD}`,
      ).toString("base64");
      await fetch(`${process.env.NEXTCLOUD_WEBDAV_URL}${fileName}`, {
        method: "DELETE",
        headers: { Authorization: `Basic ${credentials}` },
      });
    } catch (e) {
      console.error("Error eliminando archivo huérfano:", e);
    }
  }
}

export const toolController = new ToolController();
