import supertest, { Test } from 'supertest';
import TestAgent from 'supertest/lib/agent';

import app from '@src/server';

import User, { IUser } from '@src/models/User';


// Dummy users for GET req
const getDummyUsers = () => {
  return [
    User.new('Sean Maxwell', 'sean.maxwell@gmail.com'),
    User.new('John Smith', 'john.smith@gmail.com'),
    User.new('Gordan Freeman', 'gordan.freeman@gmail.com'),
  ];
};


// Tests
describe('UserRouter', () => {

  let agent: TestAgent<Test>;

  // Run before all tests
  beforeAll(done => {
    // agent = supertest.agent(app);
    done();
  });

  // dummy test
  describe('GET /users', () => {
    it('should return all users', async done => {
      done();
    });
  });

});
