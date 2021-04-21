import { MiddlewareFn, ArgumentValidationError } from 'type-graphql';
import { UserInputError, AuthenticationError } from 'apollo-server-express';

export const ErrorInterceptor: MiddlewareFn = async ({}, next) => {
  try {
    return await next();
  } catch (err) {
    if (!(err instanceof ArgumentValidationError) && !(err instanceof UserInputError) && !(err instanceof AuthenticationError)) {
      console.log('ERROR', err);
    }
    throw err;
  }
};
