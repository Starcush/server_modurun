import * as request from 'supertest';
import { expect } from 'chai';
import server from '../server';

const mysql = require('mysql');
require('dotenv').config();

const agent = request(server);

describe('user API test', () => {
  let dbConnection;

  beforeEach((done) => {
    dbConnection = mysql.createConnection({
      user: 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DBNAME,
    });
    dbConnection.connect();

    const tablename = 'user';
    dbConnection.query(`truncate ${tablename}`, done);
  });

  afterEach(() => {
    dbConnection.end();
  });

  describe('POST /signin', () => {
    it('it should respond 200 status code with user id to signin data', async () => {
      const response = await agent.post('/users/signin').send({
        email: 'login@naver.com',
        password: 'test',
      })
        .catch((error) => {
          console.log(error);
        });
      expect(response.status).to.equal(200);
      expect(response.status).to.not.equal(undefined);
    });

    it('it should respond 404 status code with user not found text', async () => {
      const response = await agent.post('/users/signin').send({
        email: 'helloWorld@javascript.com',
        password: 'helloWorld',
      });
      expect(response.status).to.equal(404);
      expect(response.text).to.equal('unvalid user');
    });

    describe('POST /signup', () => {
    // after(() => {
    //   dbConnection.query('DELETE * FROM users WHERE email="tester@naver.com"', (err) => {
    //     if (err) throw err;
    //   });
    // });
      it('it should respond 200 status code', async () => {
        const response = await agent.post('/users/signup').send({
          email: 'login@naver.com',
          password: 'test',
        });
        expect(response.status).to.equal(200);
        expect(response.status).to.not.equal(undefined);
      });

      it('it should respond 409', async () => {
        const response = await agent.post('/users/signup').send({
          email: 'login@naver.com',
          password: 'test',
        });

        expect(response.status).to.equal(409);
      });
    });

    describe('PATCH /username', () => {
    // after(() => {
    //   dbConnection.query('UPDATE users SET username="" WHERE username="tester"', (err) => {
    //     if (err) throw err;
    //   });
    // });
      it('it should respond 200 status code', async () => {
        const response = await agent.patch('/users/user/name').send({
          username: 'tester',
          session: { userEmail: 1 },
        });
        expect(response.status).to.equal(200);
        expect(response.status).to.not.equal(undefined);
      });

      it('it should respond 409', async () => {
        const response = await agent.patch('/users/user/name').send({
          username: '409tester',
        });

        expect(response.status).to.equal(409);
      });
    });

    describe('get /user/exist', () => {
      it('it should respond 200 status code', async () => {
        const response = await agent.get('/users/user/exist').send({
          email: 'existTester@naver.com',
        });
        expect(response.status).to.equal(200);
        expect(response.status).to.not.equal(undefined);
      });

      it('it should respond 409', async () => {
        const response = await agent.get('/users/user/exist').send({
          email: 'login@naver.com',
        });

        expect(response.status).to.equal(409);
      });
    });
  });
});
