import request from 'supertest';
import app from '../src/app.js';

describe('API Health Check', () => {
  it('should return 200 and a standard message on the base route', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('API OrderFlow funcionando');
  });
});
