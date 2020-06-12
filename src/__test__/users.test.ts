import * as request from 'supertest';
import { expect } from 'chai';
import server from '../server';
import userUtil from '../util/userUtil';

const mysql = require('mysql');
require('dotenv').config();

const agent = request(server); // beforeAll 이나 afterall에서 관리해서 테스트 할때만 켜지게

describe('user API test', () => {
  let dbConnection;

  beforeEach((done) => {
    dbConnection = mysql.createConnection({
      user: 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DBNAME,
    });
    dbConnection.connect();

    const password = userUtil.cryptoPassword('test');
    const queryStr = 'INSERT INTO user (id, email, password, username, loginCount, createdAt, updatedAt) VALUES (1, "login@naver.com", ?, "tester", 1, now(), now())';
    dbConnection.query(queryStr, password);
    // const tablename = 'user';
    // dbConnection.query(`truncate ${tablename}`, done); // 다 지운다
    done();
  });

  afterEach(() => {
    dbConnection.end();
  });

  describe('POST /signup', () => {
    beforeEach((done) => {
      // const password = userUtil.cryptoPassword('test');
      // const queryStr = 'INSERT INTO user (id, email, password, username, loginCount, createdAt, updatedAt) VALUES (1, "login@naver.com", ?, "tester", 1, now(), now())';
      // dbConnection.query(queryStr, password);
      // dbConnection.query('INSERT INTO user (id, email, password, username, loginCount, createdAt, updatedAt) VALUES (1, "login@naver.com", {password}, "tester", 1, now(), now())');
      done();
    });
    afterEach(async () => {
      await dbConnection.query('DELETE FROM user WHERE email="login@naver.com"', (err) => {
        if (err) throw err;
      });
    });
    it('it should respond 200 status code', async () => {
      const response = await agent.post('/users/signup').send({
        email: 'signup@naver.com',
        password: 'test',
      });
        // .set({
        //   Authorization: 'token',
        // });
      expect(response.status).to.equal(200);
      expect(response.status).to.not.equal(undefined);
    });

    it('it should respond 409', async () => {
      const response = await agent.post('/users/signup').send({
        email: 'login@naver.com',
        password: 'test',
      });
      console.dir(response.text);
      expect(response.status).to.equal(409);
    });
  });


  describe('POST /signin', () => {
    // beforeEach insert
    beforeEach((done) => {
      // dbConnection.query('INSERT INTO user (id, email, password, username, loginCount, createdAt, updatedAt) VALUES (1, "login@naver.com", "password", "tester", 1, now(), now())');
      // agent.post('/users/signup').send({
      //   email: 'login@naver.com',
      //   password: 'test',
      // });
      // const password = userUtil.cryptoPassword('test');
      // const queryStr = 'INSERT INTO user (id, email, password, username, loginCount, createdAt, updatedAt) VALUES (1, "login@naver.com", ?, "tester", 1, now(), now())';
      // dbConnection.query(queryStr, password);
      // const password = userUtil.cryptoPassword('test');
      // dbConnection.query(`INSERT INTO user (id, email, password, username, loginCount, createdAt, updatedAt) VALUES (1, "login@naver.com", ${password}, "tester", 1, now(), now())`);
      done();
    });
    afterEach(async () => {
      // await dbConnection.query('DELETE FROM user WHERE email="login@naver.com"', (err) => {
      //   if (err) throw err;
      // });
    });
    it('it should respond 200 status code with user id to signin data', async () => {
      const response = await agent.post('/users/signin').send({
        email: 'login@naver.com',
        password: 'test',
      })
        .catch((error) => {
          console.log(error);
        });
        // 에러 테스트 추가
      // expect(response.error);
      // console.dir(response);
      expect(response.status).to.equal(200);
      expect(response.body.text).to.equal('Signin Success');
    });

    it('it should respond 404 status code with user not found text', async () => {
      const response = await agent.post('/users/signin').send({
        email: 'helloWorld@javascript.com',
        password: 'helloWorld',
      });
      // console.dir(response);
      expect(response.statusCode).to.equal(404);
      expect(response.body.text).to.equal('Signin failed');
    });
  });

  describe('PATCH /username', () => {
    beforeEach(async (done) => {
      // dbConnection.query('INSERT INTO user (id, email, password, username, loginCount, createdAt, updatedAt) VALUES (1, "login@naver.com", "password", "tester", 1, now(), now())');
      // agent.post('/users/signup').send({
      //   email: 'login@naver.com',
      //   password: 'test',
      // });
      const password = userUtil.cryptoPassword('test');
      const queryStr = 'INSERT INTO user (id, email, password, username, loginCount, createdAt, updatedAt) VALUES (1, "login@naver.com", ?, "tester", 1, now(), now())';
      dbConnection.query(queryStr, password)
        .then(() => {
          done();
        });
      // const password = userUtil.cryptoPassword('test');
      // dbConnection.query(`INSERT INTO user (id, email, password, username, loginCount, createdAt, updatedAt) VALUES (1, "login@naver.com", ${password}, "tester", 1, now(), now())`);
      // dbConnection.query('UPDATE user SET username="tester" WHERE email="login@naver.com"');
    });
    afterEach(async () => {
      // await dbConnection.query('DELETE FROM user WHERE email="login@naver.com"', (err) => {
      //   if (err) throw err;
      // });
    });
    it('it should respond 200 status code', async () => {
      const response = await agent.patch('/users/user/name').send({
        username: 'tester',
        // session: { userEmail: 1 },
      });
      expect(response.status).to.equal(200);
      expect(response.status).to.not.equal(undefined);
    });

    it('it should respond 409', async () => {
      const response = await agent.patch('/users/user/name').send({
        username: 'tester',
      });

      expect(response.status).to.equal(409);
    });
  });

  describe('get /user/exist', () => {
    beforeEach((done) => {
      // dbConnection.query('INSERT INTO user (id, email, password, username, loginCount, createdAt, updatedAt) VALUES (1, "login@naver.com", "password", "tester", 1, now(), now())');
      // agent.post('/users/signup').send({
      //   email: 'login@naver.com',
      //   password: 'test',
      // });
      // const password = userUtil.cryptoPassword('test');
      // const queryStr = 'INSERT INTO user (id, email, password, username, loginCount, createdAt, updatedAt) VALUES (1, "login@naver.com", ?, "tester", 1, now(), now())';
      // dbConnection.query(queryStr, password);
      // const password = userUtil.cryptoPassword('test');
      // dbConnection.query(`INSERT INTO user (id, email, password, username, loginCount, createdAt, updatedAt) VALUES (1, "login@naver.com", ${password}, "tester", 1, now(), now())`);
      done();
    });
    afterEach(async () => {
      // await dbConnection.query('DELETE FROM user WHERE email="login@naver.com"', (err) => {
      //   if (err) throw err;
      // });
    });
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
