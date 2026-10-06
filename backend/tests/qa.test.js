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
  test('POST creates a Todo without priority using the default', async () => {
    Todo.create.mockResolvedValue(first);
    const response = await request(app).post('/api/todos').send({ title: 'First' });
    expect(response.status).toBe(201);
    expect(Todo.create).toHaveBeenCalledWith({ title: 'First' });
    expect(response.body.priority).toBe('medium');
  });
  test.each(['low', 'medium', 'high'])('POST creates a Todo with %s priority', async (priority) => {
    Todo.create.mockResolvedValue({ ...first, priority });
    const response = await request(app).post('/api/todos').send({ title: 'First', priority });
    expect(response.status).toBe(201);
    expect(Todo.create).toHaveBeenCalledWith({ title: 'First', priority });
    expect(response.body.priority).toBe(priority);
  });
  test('POST rejects an invalid priority', async () => {
    const response = await request(app).post('/api/todos').send({ title: 'First', priority: 'urgent' });
    expect(response.status).toBe(400);
    expect(Todo.create).not.toHaveBeenCalled();
  });
  test('GET returns multiple Todo records with priority, including legacy records', async () => {
    Todo.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([first, second]) });
    const response = await request(app).get('/api/todos');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual([{ ...first, priority: 'medium' }, { ...second, priority: 'medium' }]);
  });
  test('GET returns an existing Todo without priority with the default', async () => {
    Todo.findById.mockResolvedValue(first);
    const response = await request(app).get(`/api/todos/${id}`);
    expect(response.status).toBe(200);
    expect(response.body.priority).toBe('medium');
  });
  test('PUT updates Todo priority', async () => {
    Todo.findByIdAndUpdate.mockResolvedValue({ ...first, priority: 'high' });
    const response = await request(app).put(`/api/todos/${id}`).send({ priority: 'high' });
    expect(response.status).toBe(200);
    expect(response.body.priority).toBe('high');
    expect(Todo.findByIdAndUpdate).toHaveBeenCalledWith(id, { priority: 'high' }, { new: true, runValidators: true });
  });
  test('PUT rejects an invalid priority', async () => {
    const response = await request(app).put(`/api/todos/${id}`).send({ priority: 'urgent' });
    expect(response.status).toBe(400);
    expect(Todo.findByIdAndUpdate).not.toHaveBeenCalled();
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
