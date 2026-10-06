jest.mock('../src/models/Todo', () => ({ create: jest.fn(), find: jest.fn(), findById: jest.fn(), findByIdAndUpdate: jest.fn(), findByIdAndDelete: jest.fn() }));
const request = require('supertest');
const Todo = require('../src/models/Todo');
const app = require('../src/app');
const id = '507f1f77bcf86cd799439011';
const todo = { _id: id, title: 'Write tests', description: '', completed: false, priority: 'medium' };
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
  test.each(['low', 'medium', 'high'])('POST accepts %s priority', async (priority) => {
    Todo.create.mockResolvedValue({ ...todo, priority });
    const response = await request(app).post('/api/todos').send({ title: 'Priority task', priority });
    expect(response.status).toBe(201);
    expect(response.body.priority).toBe(priority);
    expect(Todo.create).toHaveBeenCalledWith({ title: 'Priority task', priority });
  });
  test('POST rejects invalid priority', async () => {
    const response = await request(app).post('/api/todos').send({ title: 'Priority task', priority: 'urgent' });
    expect(response.status).toBe(400);
    expect(Todo.create).not.toHaveBeenCalled();
  });
  test('GET /api/todos returns todos with priority', async () => {
    Todo.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([todo]) });
    const response = await request(app).get('/api/todos');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([todo]);
  });
  test('GET /api/todos includes default priority for existing records without it', async () => {
    Todo.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([{ _id: id, title: 'Legacy task', description: '', completed: false }] ) });
    const response = await request(app).get('/api/todos');
    expect(response.status).toBe(200);
    expect(response.body[0].priority).toBe('medium');
  });
  test('GET /api/todos/:id returns a todo with priority', async () => {
    Todo.findById.mockResolvedValue(todo);
    const response = await request(app).get(`/api/todos/${id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(todo);
  });
  test('GET /api/todos/:id includes default priority for an existing legacy todo', async () => {
    Todo.findById.mockResolvedValue({ _id: id, title: 'Legacy task', description: '', completed: false });
    const response = await request(app).get(`/api/todos/${id}`);
    expect(response.status).toBe(200);
    expect(response.body.priority).toBe('medium');
  });
  test('rejects malformed ids and reports missing todos', async () => {
    const invalid = await request(app).get('/api/todos/not-an-id');
    expect(invalid.status).toBe(400);
    Todo.findById.mockResolvedValue(null);
    const missing = await request(app).get(`/api/todos/${id}`);
    expect(missing.status).toBe(404);
  });
  test('PUT /api/todos/:id updates priority', async () => {
    Todo.findByIdAndUpdate.mockResolvedValue({ ...todo, priority: 'high' });
    const response = await request(app).put(`/api/todos/${id}`).send({ priority: 'high' });
    expect(response.status).toBe(200);
    expect(response.body.priority).toBe('high');
    expect(Todo.findByIdAndUpdate).toHaveBeenCalledWith(id, { priority: 'high' }, { new: true, runValidators: true });
  });
  test('PUT rejects invalid priority', async () => {
    const response = await request(app).put(`/api/todos/${id}`).send({ priority: 'urgent' });
    expect(response.status).toBe(400);
    expect(Todo.findByIdAndUpdate).not.toHaveBeenCalled();
  });
  test('PUT /api/todos/:id updates completed status and validates fields', async () => {
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
