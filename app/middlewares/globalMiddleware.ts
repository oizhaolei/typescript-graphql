import { MiddlewareFn, ArgumentValidationError } from 'type-graphql';
import { UserInputError, AuthenticationError } from 'apollo-server-express';
import log4js from '../utils/logger';

const logger = log4js('middlewares/globalMiddleware.ts');

export const ErrorInterceptor: MiddlewareFn = async ({}, next) => {
  try {
    return await next();
  } catch (err) {
    if (!(err instanceof ArgumentValidationError) && !(err instanceof UserInputError) && !(err instanceof AuthenticationError)) {
      logger.error('ERROR', err);
    }
    throw err;
  }
};
