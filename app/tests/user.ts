import 'dotenv/config';
import express from 'express';
import supertest from 'supertest';

import log4js from '../utils/logger';

const logger = log4js('tests/user');
const crud = async (app: express.Express, op_token: string): Promise<void> => {
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
          totalCount
          data {
            id
            username
            email
            roles {
              value
              title
            }
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
    expect(response.body.data.returnAllUsers.totalCount).toBeGreaterThanOrEqual(0);
    originLength = response.body.data.returnAllUsers.totalCount;
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
          totalCount
          data {
            id
            username
            email
            roles {
              value
              title
            }
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
    expect(response.body.data.returnAllUsers.totalCount).toBe(originLength + 1);
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
          totalCount
          data {
            id
            username
            email
            roles {
              value
              title
            }
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
    expect(response.body.data.returnAllUsers.totalCount).toBe(originLength);
  }
};

export default { crud };
