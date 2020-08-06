const supertest = require("supertest");
const project = require('./constants/project');
const app = require("./app");

describe('GET /', () => {
  it('should respond with a message', async () => {
    const response = await supertest(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.message).toEqual(project.message);
  });
});
