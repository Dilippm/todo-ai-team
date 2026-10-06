const priorityLabels = { low: 'Low', medium: 'Medium', high: 'High' };

function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(value));
}

export default function TodoItem({ todo, onToggle, onPriorityChange, onEdit, onDelete }) {
  const id = todo._id || todo.id;
  const priority = todo.priority || 'medium';
  return (
    <article className={`todo-item${todo.completed ? ' is-complete' : ''}`}>
      <button
        type="button"
        className={`completion-toggle${todo.completed ? ' checked' : ''}`}
        onClick={() => onToggle(todo)}
        aria-label={todo.completed ? `Mark ${todo.title} as active` : `Mark ${todo.title} as completed`}
        aria-pressed={todo.completed}
      >
        {todo.completed && <span aria-hidden="true">✓</span>}
      </button>
      <div className="todo-copy">
        <h3>{todo.title}</h3>
        {todo.description && <p>{todo.description}</p>}
        <span className="todo-date">Added {formatDate(todo.createdAt)}</span>
      </div>
      <label className={`priority-badge priority-${priority}`}>
        <span className="priority-dot" aria-hidden="true" />
        <span className="priority-text">{priorityLabels[priority] || 'Medium'}</span>
        <select aria-label={`Change priority for ${todo.title}`} value={priority} onChange={(event) => onPriorityChange(todo, event.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>
      <div className="todo-actions">
        <button className="icon-button" type="button" onClick={() => onEdit(todo)} aria-label={`Edit ${todo.title}`} title="Edit">↗</button>
        <button className="icon-button delete-button" type="button" onClick={() => onDelete(todo)} aria-label={`Delete ${todo.title}`} title="Delete">×</button>
      </div>
    </article>
  );
}
