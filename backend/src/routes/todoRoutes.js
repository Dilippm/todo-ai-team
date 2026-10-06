const express = require('express');
const controller = require('../controllers/todoController');
const router = express.Router();
router.route('/').post(controller.createTodo).get(controller.getTodos);
router.route('/:id').get(controller.getTodo).put(controller.updateTodo).delete(controller.deleteTodo);
module.exports = router;
