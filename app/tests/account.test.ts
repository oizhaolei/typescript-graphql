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

const logger = log4js('tests/account');

const op_email = 'oizhaolei@gmail.com';
const op_password = 'pass';
describe('User', () => {
  let app: express.Express;
  let op_token: string;
  beforeAll(async () => {
    // // logger.info("1 - beforeAll");
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
      const response = await request.post('/graphql').send({
        query,
      });
      expect(response.status).toBe(200);
      op_token = response.body.data.login.token;
    }
  });
  afterAll(async () => {
    // // logger.info("1 - afterAll");

    mongoose.disconnect();
  });
  test('login', async () => {
    const request = supertest(app);
    // register
    let userId;
    {
      const query = `
      mutation register {
        register(data: {
          username: "lei"
          email: "alice@gmail.com"
          password: "pass"
        }) {
          id
          username
          email
          roles {
            value
            title
          }
        }
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      logger.debug('register', response.body.data.register);
      expect(response.status).toBe(200);
      userId = response.body.data.register.id;
      expect(response.body.data.register.username).toBe('lei');
    }
    // login
    let token;
    {
      const query = `
      mutation login {
        login(data: {
          email: "alice@gmail.com"
          password: "pass"
        }) {
          token
        }
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      expect(response.status).toBe(200);
      token = response.body.data.login.token;
    }

    // profile
    {
      const query = `
      query profile {
        profile {
          id
          username
          email
          roles {
            value
            title
          }
        }
      }`;
      const response = await request
        .post('/graphql')
        .send({
          query,
        })
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      logger.info('profile', response.body.data, userId);
      expect(response.body.data.profile.id).toBe(userId);
    }

    // d
    {
      const query = `
      mutation deleteUser {
        deleteUser(id: "${userId}")
      }`;
      const response = await request
        .post('/graphql')
        .send({
          query,
        })
        .set('Authorization', `Bearer ${op_token}`);
      console.log('response.body', response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.deleteUser).toBeTruthy();
    }
  });
});
