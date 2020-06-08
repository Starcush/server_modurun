const axios = require('axios');
const mysql = require('mysql');
require('dotenv').config();

describe('user API test', () => {
  let dbConnection;

  beforeEach((done) => {
    dbConnection = mysql.createConnection({
      user: 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DBNAME,
    });
    dbConnection.connect();

    const tablename = 'users';
    dbConnection.query(`truncate ${tablename}`, done);
  });

  afterEach(() => {
    dbConnection.end();
  });

  describe('POST /signin', () => {
    it('it should respond 200 status code with user id to signin data', async () => {
      const response = await axios.post('/signin', {
        email: 'login@naver.com',
        password: 'test',
      });
      response.status.should.be.equal(200);
      response.status.should.not.be.equal(undefined);
    });

    it('it should respond 404 status code with user not found text', async () => {
      const response = await axios.post('/signin', {
        email: 'helloWorld@javascript.com',
        password: 'helloWorld',
      });
      response.status.should.be.equal(404);
      response.text.should.be.equal('unvalid user');
    });

    it('it should respond 404 status code with invalid password text', async () => {
      const response = await axios.post('/signin', {
        email: 'login@naver.com',
        password: 'helloWorld',
      });
      response.status.should.be.equal(404);
      response.text.should.be.equal('invalid password');
    });
  });

  describe('POST /signup', () => {
    after(() => {
      dbConnection.query('DELETE * FROM users WHERE email="tester@naver.com"', (err: string) => {
        if (err) throw err;
      });
    });
    it('it should respond 200 status code', async () => {
      const response = await axios.post('/signup', {
        email: 'uptester@naver.com',
        password: 'test',
      });
      response.status.should.be.equal(200);
      response.status.should.not.be.equal(undefined);
    });

    it('it should respond 404', async () => {
      const response = await axios.post('/signup').send({
        email: 'helloWorld@javascript.com',
        password: 'helloWorld',
      });

      response.status.should.be.equal(404);
    });
  });

  describe('PATCH /username', () => {
    after(() => {
      dbConnection.query('UPDATE users SET username="" WHERE username="tester"', (err: string) => {
        if (err) throw err;
      });
    });
    it('it should respond 200 status code', async () => {
      const response = await axios.patch('/user/name', {
        username: 'tester',
        session: { userEmail: 1 },
      });
      response.status.should.be.equal(200);
      response.status.should.not.be.equal(undefined);
    });

    it('it should respond 409', async () => {
      const response = await axios.patch('/user/name', {
        username: '409tester',
      });

      response.status.should.be.equal(409);
    });
  });

  describe('get /user/exist', () => {
    it('it should respond 200 status code', async () => {
      const response = await axios.post('/user/exist', {
        email: 'existTester@naver.com',
      });
      response.status.should.be.equal(200);
      response.status.should.not.be.equal(undefined);
    });

    it('it should respond 409', async () => {
      const response = await axios.post('/user/exist', {
        email: 'login@javascript.com',
        password: 'helloWorld',
      });

      response.status.should.be.equal(409);
    });
  });
});
