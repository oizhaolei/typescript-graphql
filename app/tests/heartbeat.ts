import express from 'express';
import supertest from 'supertest';

const normal = async (app: express.Express): Promise<void> => {
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
};
export default { normal };
