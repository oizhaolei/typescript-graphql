import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import supertest from 'supertest';

import App from '../app';
import { CategoryResolver } from '../resolvers/Category';
import { ProductResolver } from '../resolvers/Product';
import { CartResolver } from '../resolvers/Cart';
import { UserResolver } from '../resolvers/User';
import { OrderResolver } from '../resolvers/Order';
import log4js from '../utils/logger';

import heartbeat from './heartbeat';
import jwt from './jwt';
import account from './account';
import cart from './cart';
import category from './category';
import product from './product';
import user from './user';

const logger = log4js('tests/user');

const op_email = 'oizhaolei@gmail.com';
const op_password = 'pass';
describe('User', () => {
  let app: express.Express;
  let op_token: string;
  beforeAll(async () => {
    logger.debug('beforeAll');
    app = await App([CategoryResolver, ProductResolver, UserResolver, CartResolver, OrderResolver]);

    // login
    const request = supertest(app);
    {
      const query = `
      mutation login {
        login(data: {
          email: "${op_email}"
          password: "${op_password}"
        }) {
          token
        }
      }`;
      const response = await request
        .post('/graphql')
        .send({
          query,
        })
        .set('Authorization', `Bearer ${op_token}`);
      expect(response.status).toBe(200);
      op_token = response.body.data.login.token;
    }
  });
  afterAll(async () => {
    // // console.log("1 - afterAll");
    mongoose.disconnect();
  });

  test('heartbeat.normal', async () => await heartbeat.normal(app));
  test('jwt.normal', jwt.normal);
  test('account.login', async () => await account.login(app, op_token));
  test('cart.crud', async () => await cart.crud(app));
  test('category.crud', async () => await category.crud(app));
  test('product.crud', async () => await product.crud(app));
  test('user.crud', async () => await user.crud(app, op_token));
});
