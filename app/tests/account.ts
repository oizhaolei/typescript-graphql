import express from 'express';
import supertest from 'supertest';

import log4js from '../utils/logger';

const logger = log4js('tests/account');

const login = async (app: express.Express, op_token: string): Promise<void> => {
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
    expect(response.status).toBe(200);
    expect(response.body.data.deleteUser).toBeTruthy();
  }
};

export default { login };
