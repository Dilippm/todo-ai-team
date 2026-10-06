jest.mock('../src/models/Todo', () => ({ create: jest.fn(), find: jest.fn(), findById: jest.fn(), findByIdAndUpdate: jest.fn(), findByIdAndDelete: jest.fn() }));
const request = require('supertest');
const Todo = require('../src/models/Todo');
const app = require('../src/app');
const id = '507f1f77bcf86cd799439011';
const todo = { _id: id, title: 'Write tests', description: '', completed: false };
beforeEach(() => jest.clearAllMocks());
describe('Todo API', () => {
  test('POST /api/todos creates a todo', async () => {
    Todo.create.mockResolvedValue(todo);
    const response = await request(app).post('/api/todos').send({ title: 'Write tests' });
    expect(response.status).toBe(201);
    expect(response.body).toEqual(todo);
  });
  test('POST /api/todos validates required title', async () => {
    const response = await request(app).post('/api/todos').send({ title: '  ' });
    expect(response.status).toBe(400);
    expect(Todo.create).not.toHaveBeenCalled();
  });
  test('GET /api/todos returns todos', async () => {
    Todo.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([todo]) });
    const response = await request(app).get('/api/todos');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([todo]);
  });
  test('GET /api/todos/:id returns a todo', async () => {
    Todo.findById.mockResolvedValue(todo);
    const response = await request(app).get(`/api/todos/${id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(todo);
  });
  test('rejects malformed ids and reports missing todos', async () => {
    const invalid = await request(app).get('/api/todos/not-an-id');
    expect(invalid.status).toBe(400);
    Todo.findById.mockResolvedValue(null);
    const missing = await request(app).get(`/api/todos/${id}`);
    expect(missing.status).toBe(404);
  });
  test('PUT /api/todos/:id updates a todo and validates fields', async () => {
    Todo.findByIdAndUpdate.mockResolvedValue({ ...todo, completed: true });
    const updated = await request(app).put(`/api/todos/${id}`).send({ completed: true });
    expect(updated.status).toBe(200);
    expect(updated.body.completed).toBe(true);
    const invalid = await request(app).put(`/api/todos/${id}`).send({ completed: 'yes' });
    expect(invalid.status).toBe(400);
  });
  test('DELETE /api/todos/:id returns 204 or 404', async () => {
    Todo.findByIdAndDelete.mockResolvedValue(todo);
    expect((await request(app).delete(`/api/todos/${id}`)).status).toBe(204);
    Todo.findByIdAndDelete.mockResolvedValue(null);
    expect((await request(app).delete(`/api/todos/${id}`)).status).toBe(404);
  });
});
