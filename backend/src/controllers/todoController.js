const mongoose = require('mongoose');
const Todo = require('../models/Todo');
const allowedFields = new Set(['title', 'description', 'completed']);

function validateTodoInput(body, { partial = false } = {}) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return 'Request body must be a JSON object';
  const keys = Object.keys(body);
  if (keys.some((key) => !allowedFields.has(key))) return 'Only title, description, and completed are allowed';
  if (partial && keys.length === 0) return 'At least one field must be provided';
  if (!partial && (!Object.prototype.hasOwnProperty.call(body, 'title') || typeof body.title !== 'string' || !body.title.trim())) return 'Title is required and must be a non-empty string';
  if ('title' in body && (typeof body.title !== 'string' || !body.title.trim())) return 'Title must be a non-empty string';
  if ('description' in body && typeof body.description !== 'string') return 'Description must be a string';
  if ('completed' in body && typeof body.completed !== 'boolean') return 'Completed must be a boolean';
  return null;
}

function validateId(id, res) {
  if (!mongoose.isObjectIdOrHexString(id)) {
    res.status(400).json({ error: 'Invalid todo id' });
    return false;
  }
  return true;
}

exports.createTodo = async (req, res) => {
  const error = validateTodoInput(req.body);
  if (error) return res.status(400).json({ error });
  const todo = await Todo.create(req.body);
  return res.status(201).json(todo);
};
exports.getTodos = async (_req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  return res.status(200).json(todos);
};
exports.getTodo = async (req, res) => {
  if (!validateId(req.params.id, res)) return;
  const todo = await Todo.findById(req.params.id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  return res.status(200).json(todo);
};
exports.updateTodo = async (req, res) => {
  if (!validateId(req.params.id, res)) return;
  const error = validateTodoInput(req.body, { partial: true });
  if (error) return res.status(400).json({ error });
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  return res.status(200).json(todo);
};
exports.deleteTodo = async (req, res) => {
  if (!validateId(req.params.id, res)) return;
  const todo = await Todo.findByIdAndDelete(req.params.id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  return res.status(204).send();
};
exports.handleError = (err, _req, res, _next) => {
  if (err instanceof mongoose.Error.ValidationError || err instanceof mongoose.Error.CastError) return res.status(400).json({ error: err.message });
  return res.status(500).json({ error: 'Internal server error' });
};
