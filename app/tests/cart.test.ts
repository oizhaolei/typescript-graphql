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

describe('Cart', () => {
  let app: express.Express;
  beforeAll(async () => {
    // console.log("1 - beforeAll");
    app = await App([CategoryResolver, ProductResolver, UserResolver, CartResolver, OrderResolver]);
  });
  afterAll(async () => {
    // console.log("1 - afterAll");

    mongoose.disconnect();
  });

  test('crud', async () => {
    const request = supertest(app);
    // r
    let originLength;
    {
      const query = `
      query returnAllCarts {
        returnAllCarts {
          id
        }
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      expect(response.status).toBe(200);
      expect(response.body.data.returnAllCarts.length).toBeGreaterThanOrEqual(0);
      originLength = response.body.data.returnAllCarts.length;
    }
    // c
    let productId;
    let categoryId;
    let cartId;
    {
      const query = `
      mutation createCategory {
        createCategory(data: {
          name: "woman",
          description: "for woman"
        }) {
          id
          name
          description
        }
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      categoryId = response.body.data.createCategory.id;
    }
    {
      const query = `
      mutation createProduct {
        createProduct(data: {
          name: "woman",
          description: "for woman"
          color: "red"
          stock: 11
          price: 12
          category: "${categoryId}"
        }) {
          id
          name
          description
          color
          stock
          price
          category {
            id
            name
          }
        }
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      productId = response.body.data.createProduct.id;
    }
    {
      const query = `
      mutation createCart {
        createCart(data: {
          products: ["${productId}"]
        }) {
          id
          products {
            id
            name
            description
            color
            stock
            price
            category {
              id
              name
            }
          }
        }
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      expect(response.status).toBe(200);
      cartId = response.body.data.createCart.id;
    }
    {
      const query = `
      query returnSingleCart {
        returnSingleCart(id: "${cartId}") {
          id
          products {
            id
            name
            description
            color
            stock
            price
            category {
              id
              name
            }
          }
        }
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      expect(response.status).toBe(200);
      expect(response.body.data.returnSingleCart.id).toBe(cartId);
    }
    {
      const query = `
      query returnAllCarts {
        returnAllCarts {
          id
          products {
            id
            name
            description
            color
            stock
            price
            category {
              id
              name
            }
          }
       }
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      expect(response.status).toBe(200);
      expect(response.body.data.returnAllCarts.length).toBe(originLength + 1);
    }
    // u
    // d
    {
      const query = `
      mutation deleteCart {
        deleteCart(id: "${cartId}")
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      expect(response.status).toBe(200);
      expect(response.body.data.deleteCart).toBeTruthy();
    }
    // d
    {
      const query = `
      mutation deleteProduct {
        deleteProduct(id: "${productId}")
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      expect(response.status).toBe(200);
    }
    {
      const query = `
      mutation deleteCategory {
        deleteCategory(id: "${categoryId}")
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      expect(response.status).toBe(200);
      expect(response.body.data.deleteCategory).toBeTruthy();
    }
    // r
    {
      const query = `
      query returnAllCarts {
        returnAllCarts {
          id
          products {
            id
            name
            description
            color
            stock
            price
            category {
              id
              name
            }
          }
        }
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      expect(response.status).toBe(200);
      expect(response.body.data.returnAllCarts.length).toBe(originLength);
    }
    // da
    {
      const query = `
      mutation deleteAllCarts {
        deleteAllCarts
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      expect(response.status).toBe(200);
      expect(response.body.data.deleteAllCarts).toBeTruthy();
    }
    // r
    {
      const query = `
      query returnAllCarts {
        returnAllCarts {
          id
          products {
            id
            name
            description
            color
            stock
            price
            category {
              id
              name
            }
          }
        }
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      expect(response.status).toBe(200);
      expect(response.body.data.returnAllCarts.length).toBe(0);
    }
  });
});
