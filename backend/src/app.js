const express = require('express');
const todoRoutes = require('./routes/todoRoutes');
const { handleError } = require('./controllers/todoController');
const app = express();
app.use(express.json());
app.use('/api/todos', todoRoutes);
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) return res.status(400).json({ error: 'Invalid JSON body' });
  return handleError(err, req, res, next);
});
module.exports = app;
