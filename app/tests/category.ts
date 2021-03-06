import 'dotenv/config';
import express from 'express';
import supertest from 'supertest';

const crud = async (app: express.Express): Promise<void> => {
  const request = supertest(app);
  // r
  let originLength;
  {
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
    originLength = response.body.data.returnAllCategories.length;
  }
  // c
  let categoryId;
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
    expect(response.status).toBe(200);
    categoryId = response.body.data.createCategory.id;
    expect(response.body.data.createCategory.name).toBe('woman');
  }
  {
    const query = `
      query returnSingleCategory {
        returnSingleCategory(id: "${categoryId}") {
          id
          name
          description
        }
      }`;
    const response = await request.post('/graphql').send({
      query,
    });
    expect(response.status).toBe(200);
    expect(response.body.data.returnSingleCategory.name).toBe('woman');
  }
  {
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
    expect(response.body.data.returnAllCategories.length).toBe(originLength + 1);
  }
  // {
  //   const query = `
  //   query returnPageCategories {
  //     returnPageCategories(skip:2 limit:2) {
  //       count，
  //       data: {
  //         id
  //         name
  //         description
  //       }
  //     }
  //   }`;
  //   const response = await request.post('/graphql').send({
  //     query,
  //   });
  //   expect(response.status).toBe(200);
  //   expect(response.body.data.returnAllCategories.length).toBe(originLength + 1);
  // }
  // u
  {
    const query = `
      mutation updateCategory {
        updateCategory(
          id: "${categoryId}",
          data: {
            name: "girl"
            description: "for girl"
          }
        ) {
          id
          name
          description
        }
      }`;
    const response = await request.post('/graphql').send({
      query,
    });
    expect(response.status).toBe(200);
    expect(response.body.data.updateCategory.name).toBe('girl');
  }
  // d
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
  // delete again
  {
    const query = `
      mutation deleteCategory {
        deleteCategory(id: "${categoryId}")
      }`;
    const response = await request.post('/graphql').send({
      query,
    });
    console.log('response.body:', response.body);
    expect(response.status).toBe(200);
  }
  // r
  {
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
    expect(response.body.data.returnAllCategories.length).toBe(originLength);
  }
  // delete all
  {
    const query = `
      mutation deleteAllCategories {
        deleteAllCategories
      }`;
    const response = await request.post('/graphql').send({
      query,
    });
    expect(response.status).toBe(200);
    expect(response.body.data.deleteAllCategories).toBeTruthy();
  }
  // r
  {
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
    expect(response.body.data.returnAllCategories.length).toBe(0);
  }
};

export default { crud };
