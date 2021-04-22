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

const logger = log4js('tests/user');

const op_email = 'oizhaolei@gmail.com';
const op_password = 'pass';
describe('User', () => {
  let app: express.Express;
  let op_token: string;
  beforeAll(async () => {
    // // console.log("1 - beforeAll");
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

  test('crud', async () => {
    const request = supertest(app);
    // r
    let originLength;
    {
      const query = `
      query returnAllUsers {
        returnAllUsers(data: {
          skip: 0
          limit: 1024
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
      const response = await request
        .post('/graphql')
        .send({
          query,
        })
        .set('Authorization', `Bearer ${op_token}`);
      expect(response.status).toBe(200);
      expect(response.body.data.returnAllUsers.length).toBeGreaterThanOrEqual(0);
      originLength = response.body.data.returnAllUsers.length;
    }
    // c
    let userId;
    {
      const query = `
      mutation createUser {
        createUser(data: {
          username: "lei"
          email: "john1@gmail.com"
          password: "pass"
          roles: [{
            value: "value"
            title: "title"
          }]
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
      const response = await request
        .post('/graphql')
        .send({
          query,
        })
        .set('Authorization', `Bearer ${op_token}`);
      logger.debug('createUser', response.body.data);
      expect(response.status).toBe(200);
      userId = response.body.data.createUser.id;
      expect(response.body.data.createUser.username).toBe('lei');
    }
    {
      const query = `
      query returnSingleUser {
        returnSingleUser(id: "${userId}") {
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
        .set('Authorization', `Bearer ${op_token}`);
      expect(response.status).toBe(200);
      expect(response.body.data.returnSingleUser.username).toBe('lei');
    }
    {
      const query = `
      query returnAllUsers {
        returnAllUsers(data: {
        skip: 0
        limit: 1024
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
      const response = await request
        .post('/graphql')
        .send({
          query,
        })
        .set('Authorization', `Bearer ${op_token}`);
      expect(response.status).toBe(200);
      expect(response.body.data.returnAllUsers.length).toBe(originLength + 1);
    }
    // u
    {
      const query = `
      mutation updateUser {
        updateUser(
          id: "${userId}"
          data: {
            username: "ray"
            email: "john2@gmail.com"
            password: "pass"
            roles: [{
              value: "value"
              title: "title"
            }]
          }
        ) {
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
        .set('Authorization', `Bearer ${op_token}`);
      expect(response.status).toBe(200);
      expect(response.body.data.updateUser.username).toBe('ray');
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
      expect(response.status).toBe(200);
      expect(response.body.data.deleteUser).toBeTruthy();
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
      expect(response.status).toBe(200);
    }
    // r
    {
      const query = `
      query returnAllUsers {
        returnAllUsers(data: {
        skip: 0
        limit: 1024
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
      const response = await request
        .post('/graphql')
        .send({
          query,
        })
        .set('Authorization', `Bearer ${op_token}`);
      expect(response.status).toBe(200);
      expect(response.body.data.returnAllUsers.length).toBe(originLength);
    }
  });
});
