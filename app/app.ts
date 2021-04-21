import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import mongoose from 'mongoose';

import { logger, stream } from './utils/logger';

import { Context } from './interfaces/context.interface';
import { verifyToken, authChecker } from './utils/auth-checker';
import { ErrorInterceptor } from './middlewares/globalMiddleware';

const initializeMiddlewares = (app: express.Express) => {
  if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined', { stream }));
    app.use(cors({ origin: 'your.domain.com', credentials: true }));
  } else if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev', { stream }));
    app.use(cors({ origin: true, credentials: true }));
  }

  app.use(hpp());
  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

// create mongoose connection
const initializeMongoose = async () => {
  const { MONGODB_URI_LOCAL } = process.env;
  await mongoose.connect(`${MONGODB_URI_LOCAL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.set('debug', (coll: string, method: string, query: any, doc: any, options: any) => {
    logger.debug(`${coll}.${method}.(${JSON.stringify(query)})`, JSON.stringify(doc), options || '');
  });
  logger.info('🟢 The database is connected.');
};

const initializeApollo = async (app: express.Express, resolvers: any) => {
  if (!resolvers || resolvers.length === 0) {
    return;
  }

  const schema = await buildSchema({
    resolvers,
    authChecker,
    emitSchemaFile: true,
    validate: false,
    globalMiddlewares: [ErrorInterceptor],
  });

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      // Get the user token from the headers.
      const user = await verifyToken(req.headers.authorization || '');
      // add the user to the context
      const ctx: Context = {
        user,
      };
      return ctx;
    },
  });
  server.applyMiddleware({ app });
};

export default async (resolvers: any): Promise<express.Express> => {
  const app = express();

  initializeMiddlewares(app);
  await initializeMongoose();
  await initializeApollo(app, resolvers);

  return app;
};
