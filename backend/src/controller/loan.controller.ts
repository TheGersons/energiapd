import { Request, Response } from "express";
import { loanRepository } from "repository/loan.repository";

class LoanController {
  findAll(req: Request, res: Response) {
    loanRepository
      .findAll()
      .then((rs) => res.status(200).json(rs))
      .catch((error) => res.status(500).json(error));
  }

  findOne({ query }: Request, res: Response) {
    if (!query || Object.keys(query).length === 0) {
      res.json({});
      return;
    }
    loanRepository
      .findOne(query)
      .then((rs) => res.status(200).json(rs))
      .catch((error) => res.status(500).json(error));
  }

  create({ body }: Request, res: Response) {
    loanRepository
      .create(body.loan)
      .then((rs) => res.status(200).json(rs))
      .catch((error) => {
        console.log(error)
        res.status(500).json(error)});
  }

  update({ body }: Request, res: Response) {
    loanRepository
      .update(body.loan)
      .then((rs) => res.status(200).json(rs))
      .catch((error) => res.status(500).json(error));
  }
}

export const loanController = new LoanController();
