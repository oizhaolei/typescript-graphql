import 'dotenv/config';
import express from 'express';
import supertest from 'supertest';

const crud = async (app: express.Express): Promise<void> => {
  const request = supertest(app);
  // r
  let originLength;
  {
    const query = `
      query returnAllCarts {
        returnAllCarts(data: {
        skip: 0
        limit: 1024
      }) {
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
          name: "woman"
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
          name: "woman"
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
        returnAllCarts(data: {
        skip: 0
        limit: 1024
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
        returnAllCarts(data: {
        skip: 0
        limit: 1024
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
    expect(response.body.data.returnAllCarts.length).toBe(originLength);
  }
  // delete all
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
        returnAllCarts(data: {
        skip: 0
        limit: 1024
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
    expect(response.body.data.returnAllCarts.length).toBe(0);
  }
};

export default { crud };
