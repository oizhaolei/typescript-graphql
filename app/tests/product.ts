import 'dotenv/config';
import express from 'express';
import supertest from 'supertest';

const crud = async (app: express.Express): Promise<void> => {
  const request = supertest(app);
  // r
  let originLength;
  {
    const query = `
      query returnAllProducts {
        returnAllProducts(data: {
          skip: 0
          limit: 1024
        }) {
          id
          name
          description
          color
        }
      }`;
    const response = await request.post('/graphql').send({
      query,
    });
    expect(response.status).toBe(200);
    expect(response.body.data.returnAllProducts.length).toBeGreaterThanOrEqual(0);
    originLength = response.body.data.returnAllProducts.length;
  }
  // c
  let categoryId: string;
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
  const productIds = await Promise.all(
    Array.from(Array(10).keys()).map(async i => {
      const query = `
      mutation createProduct {
        createProduct(data: {
          name: "woman"
          description: "for woman - ${i}"
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
      expect(response.status).toBe(200);
      const productId = response.body.data.createProduct.id;
      expect(response.body.data.createProduct.name).toBe('woman');
      return productId;
    }),
  );

  {
    const query = `
      query returnSingleProduct {
        returnSingleProduct(id: "${productIds[0]}") {
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
    expect(response.status).toBe(200);
    expect(response.body.data.returnSingleProduct.name).toBe('woman');
  }
  {
    const query = `
      query returnAllProducts {
        returnAllProducts(data: {
          skip: 0
          limit: 1024
        }) {
          id
          name
          description
          color
          stock
          price
       }
      }`;
    const response = await request.post('/graphql').send({
      query,
    });
    expect(response.status).toBe(200);
    expect(response.body.data.returnAllProducts.length).toBe(originLength + 10);
  }
  // u
  // d
  await Promise.all(
    Array.from(Array(10).keys()).map(async i => {
      const query = `
      mutation deleteProduct {
        deleteProduct(id: "${productIds[i]}")
      }`;
      const response = await request.post('/graphql').send({
        query,
      });
      expect(response.status).toBe(200);
      expect(response.body.data.deleteProduct).toBeTruthy();
    }),
  );
  // r
  {
    const query = `
      query returnAllProducts {
        returnAllProducts(data: {
          skip: 0
          limit: 1024
        }) {
          id
          name
          description
          color
          stock
          price
        }
      }`;
    const response = await request.post('/graphql').send({
      query,
    });
    expect(response.status).toBe(200);
    expect(response.body.data.returnAllProducts.length).toBe(originLength);
  }
  // delete all
  {
    const query = `
      mutation deleteAllProducts {
        deleteAllProducts
      }`;
    const response = await request.post('/graphql').send({
      query,
    });
    expect(response.status).toBe(200);
    expect(response.body.data.deleteAllProducts).toBeTruthy();
  }
  // r
  {
    const query = `
      query returnAllProducts {
        returnAllProducts(data: {
          skip: 0
          limit: 1024
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
    expect(response.status).toBe(200);
    expect(response.body.data.returnAllProducts.length).toBe(0);
  }
};

export default { crud };
