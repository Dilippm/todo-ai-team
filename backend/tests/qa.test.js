jest.mock('../src/models/Todo', () => ({ create: jest.fn(), find: jest.fn(), findById: jest.fn(), findByIdAndUpdate: jest.fn(), findByIdAndDelete: jest.fn() }));
const request = require('supertest');
const Todo = require('../src/models/Todo');
const app = require('../src/app');
const id = '507f1f77bcf86cd799439011';
const first = { _id: id, title: 'First', description: '', completed: false };
const second = { _id: '507f191e810c19729de860ea', title: 'Second', description: 'Other', completed: true };
beforeEach(() => jest.clearAllMocks());

describe('QA scenarios', () => {
  test('POST rejects a missing title', async () => {
    const response = await request(app).post('/api/todos').send({ description: 'No title' });
    expect(response.status).toBe(400);
    expect(Todo.create).not.toHaveBeenCalled();
  });
  test('POST rejects an empty title', async () => {
    const response = await request(app).post('/api/todos').send({ title: '' });
    expect(response.status).toBe(400);
  });
  test('GET rejects an invalid Todo ID', async () => {
    expect((await request(app).get('/api/todos/invalid')).status).toBe(400);
  });
  test('GET reports a non-existent Todo', async () => {
    Todo.findById.mockResolvedValue(null);
    expect((await request(app).get(`/api/todos/${id}`)).status).toBe(404);
  });
  test('malformed JSON returns 400', async () => {
    const response = await request(app).post('/api/todos').set('Content-Type', 'application/json').send('{"title":');
    expect(response.status).toBe(400);
  });
  test('database failure returns 500', async () => {
    Todo.create.mockRejectedValue(new Error('database unavailable'));
    const response = await request(app).post('/api/todos').send({ title: 'Failure case' });
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal server error' });
  });
  test('GET returns multiple Todo records', async () => {
    Todo.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([first, second]) });
    const response = await request(app).get('/api/todos');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual([first, second]);
  });
  test('PUT updates completed status', async () => {
    Todo.findByIdAndUpdate.mockResolvedValue({ ...first, completed: true });
    const response = await request(app).put(`/api/todos/${id}`).send({ completed: true });
    expect(response.status).toBe(200);
    expect(response.body.completed).toBe(true);
    expect(Todo.findByIdAndUpdate).toHaveBeenCalledWith(id, { completed: true }, { new: true, runValidators: true });
  });
  test('DELETE removes a Todo', async () => {
    Todo.findByIdAndDelete.mockResolvedValue(first);
    expect((await request(app).delete(`/api/todos/${id}`)).status).toBe(204);
  });
});
