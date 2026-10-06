import { useEffect, useState } from 'react';

const emptyForm = { title: '', description: '', priority: 'medium' };

export default function TodoForm({ todo, onSubmit, onCancel, saving, error }) {
  const [form, setForm] = useState(emptyForm);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setForm(todo ? {
      title: todo.title || '',
      description: todo.description || '',
      priority: todo.priority || 'medium',
    } : emptyForm);
    setValidationError('');
  }, [todo]);

  function change(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!form.title.trim()) {
      setValidationError('Add a title before saving.');
      return;
    }
    setValidationError('');
    await onSubmit({ ...form, title: form.title.trim(), description: form.description.trim() });
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onCancel();
    }}>
      <section className="form-panel" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">{todo ? 'REFINE YOUR PLAN' : 'MAKE IT HAPPEN'}</span>
            <h2 id="form-title">{todo ? 'Edit task' : 'New task'}</h2>
          </div>
          <button className="icon-button close-button" type="button" onClick={onCancel} aria-label="Close form">×</button>
        </div>
        <form onSubmit={submit}>
          <label className="field-label" htmlFor="todo-title">Task name</label>
          <input id="todo-title" name="title" value={form.title} onChange={change} maxLength={160} autoFocus placeholder="What needs to get done?" />
          <label className="field-label" htmlFor="todo-description">Details <span className="optional-label">Optional</span></label>
          <textarea id="todo-description" name="description" value={form.description} onChange={change} rows="4" placeholder="Add a little context…" />
          <label className="field-label" htmlFor="todo-priority">Priority</label>
          <select id="todo-priority" name="priority" value={form.priority} onChange={change}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {validationError && <p className="field-error" role="alert">{validationError}</p>}
          {error && <p className="field-error" role="alert">{error}</p>}
          <div className="form-actions">
            <button className="button button-quiet" type="button" onClick={onCancel}>Cancel</button>
            <button className="button button-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : todo ? 'Save changes' : 'Add task'}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
