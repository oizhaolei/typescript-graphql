import { NextFunction, Request, Response } from 'express';
import HttpException from '../HttpException';
import { logger } from '../utils/logger';

const errorMiddleware = (error: HttpException, _req: Request, res: Response, next: NextFunction): void => {
  try {
    console.log('error', error);
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';

    logger.error(`StatusCode : ${status}, Message : ${message}`);
    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
