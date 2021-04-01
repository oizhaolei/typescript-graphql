import { NextFunction, Request, Response } from 'express';

class IndexController {
  public index = (_req: Request, res: Response, next: NextFunction) => {
    try {
      res
        .json({
          msg: 'Hello World!',
        })
        .sendStatus(200);
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
