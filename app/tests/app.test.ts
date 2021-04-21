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

describe('normal', () => {
  let app: express.Express;
  beforeAll(async () => {
    // console.log("1 - beforeAll");
    app = await App([CategoryResolver, ProductResolver, UserResolver, CartResolver, OrderResolver]);
  });
  afterAll(async () => {
    // console.log("1 - afterAll");
    mongoose.disconnect();
  });
  test('GET: /graphql', async done => {
    const request = supertest(app);
    const query = `
    query returnAllCategories {
      returnAllCategories(data: {
        skip: 0
        limit: 1024
      }) {
        id
        name
        description
      }
    }`;
    const response = await request.post('/graphql').send({
      query,
    });
    expect(response.status).toBe(200);
    expect(response.body.data.returnAllCategories.length).toBeGreaterThanOrEqual(0);
    done();
  });
});
