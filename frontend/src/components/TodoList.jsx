import TodoItem from './TodoItem.jsx';

export default function TodoList({ todos, onToggle, onPriorityChange, onEdit, onDelete }) {
  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo._id || todo.id} todo={todo} onToggle={onToggle} onPriorityChange={onPriorityChange} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
