const Todo = require('../src/models/Todo');

describe('Todo priority model validation', () => {
  test('defaults priority to medium', async () => {
    const todo = new Todo({ title: 'Default priority' });
    expect(todo.priority).toBe('medium');
    await expect(todo.validate()).resolves.toBeUndefined();
  });

  test.each(['low', 'medium', 'high'])('accepts %s priority', async (priority) => {
    const todo = new Todo({ title: 'Valid priority', priority });
    await expect(todo.validate()).resolves.toBeUndefined();
  });

  test('rejects unsupported priority', async () => {
    const todo = new Todo({ title: 'Invalid priority', priority: 'urgent' });
    await expect(todo.validate()).rejects.toMatchObject({ errors: { priority: expect.any(Object) } });
  });
});
