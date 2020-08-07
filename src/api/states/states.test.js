const supertest = require('supertest');
const app = require('../../app');

describe('Get all states', () => {
    it('should respond with an array of states', async () => {
        const response = await supertest(app)
        .get('/api/v1/states')
        .expect('Content-Type', /json/)
        .expect(200);

        expect(response.body.length).toBeGreaterThan(0);
    });
});

describe('Get individual state', () => {
    it('should respond with an individual state', async () => {
        const response = await supertest(app)
        .get('/api/v1/states/1')
        .expect('Content-Type', /json/)
        .expect(200);

        expect(response.body.id).toBe(1);
    });

    it('should respond with a 404 when state not found', async () => {
        await supertest(app)
        .get('/api/v1/states/100')
        .expect('Content-Type', /json/)
        .expect(404);
    });
});