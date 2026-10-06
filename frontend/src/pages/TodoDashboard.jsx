import { useCallback, useEffect, useMemo, useState } from 'react';
import TodoForm from '../components/TodoForm.jsx';
import TodoList from '../components/TodoList.jsx';
import { createTodo, deleteTodo, getApiError, getTodos, updateTodo } from '../services/todoApi.js';

const filters = ['all', 'open', 'completed'];

export default function TodoDashboard() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [filter, setFilter] = useState('all');
  const [formTodo, setFormTodo] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadTodos = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await getTodos();
      setTodos(Array.isArray(data) ? data : []);
    } catch (error) {
      setLoadError(getApiError(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTodos(); }, [loadTodos]);

  const openTodos = useMemo(() => todos.filter((todo) => !todo.completed), [todos]);
  const completedTodos = useMemo(() => todos.filter((todo) => todo.completed), [todos]);
  const visibleTodos = useMemo(() => {
    if (filter === 'open') return openTodos;
    if (filter === 'completed') return completedTodos;
    return todos;
  }, [filter, openTodos, completedTodos, todos]);

  function showForm(todo = null) {
    setFormTodo(todo);
    setFormOpen(true);
    setActionError('');
  }

  async function saveTodo(values) {
    setSaving(true);
    setActionError('');
    try {
      if (formTodo) await updateTodo(formTodo._id || formTodo.id, values);
      else await createTodo(values);
      setFormOpen(false);
      setFormTodo(null);
      await loadTodos();
    } catch (error) {
      setActionError(getApiError(error));
    } finally {
      setSaving(false);
    }
  }

  async function changeTodo(todo, updates) {
    const id = todo._id || todo.id;
    setActionError('');
    try {
      await updateTodo(id, updates);
      await loadTodos();
    } catch (error) {
      setActionError(getApiError(error));
    } finally {
    }
  }

  async function removeTodo(todo) {
    const id = todo._id || todo.id;
    setActionError('');
    try {
      await deleteTodo(id);
      setTodos((current) => current.filter((item) => (item._id || item.id) !== id));
    } catch (error) {
      setActionError(getApiError(error));
    } finally {
    }
  }

  const hasTodos = todos.length > 0;
  const sectionTitle = filter === 'open' ? 'In progress' : filter === 'completed' ? 'Completed' : 'Your tasks';

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Daymark home">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>daymark<span className="brand-period">.</span></span>
        </a>
        <div className="topbar-note"><span className="status-dot" /> Your day, in good order</div>
      </header>

      <main id="top" className="dashboard">
        <section className="welcome-row">
          <div>
            <span className="eyebrow">A CLEARER WAY FORWARD</span>
            <h1>Make room for<br /><em>what matters.</em></h1>
            <p className="welcome-copy">One step at a time. Keep your priorities close and your day moving.</p>
          </div>
          <div className="welcome-illustration" aria-hidden="true">
            <div className="sun-orb" />
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <span className="illustration-star star-one">✳</span>
            <span className="illustration-star star-two">✦</span>
            <span className="illustration-leaf">⌁</span>
          </div>
        </section>

        <section className="summary-grid" aria-label="Task summary">
          <div className="summary-card summary-total">
            <span className="summary-label">ALL TASKS</span>
            <strong>{loading ? '—' : todos.length.toString().padStart(2, '0')}</strong>
            <span className="summary-caption">on your list</span>
          </div>
          <div className="summary-card summary-open">
            <span className="summary-label">IN PROGRESS</span>
            <strong>{loading ? '—' : openTodos.length.toString().padStart(2, '0')}</strong>
            <span className="summary-caption">ready for a next step</span>
          </div>
          <div className="summary-card summary-done">
            <span className="summary-label">COMPLETED</span>
            <strong>{loading ? '—' : completedTodos.length.toString().padStart(2, '0')}</strong>
            <span className="summary-caption">small wins add up</span>
          </div>
          <div className="summary-accent" aria-hidden="true"><span>✦</span><span>Make today<br />count.</span></div>
        </section>

        <section className="tasks-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">YOUR WORKSPACE</span>
              <h2>{sectionTitle}<span className="heading-count">{loading ? '' : visibleTodos.length}</span></h2>
            </div>
            <button className="button button-primary add-button" type="button" onClick={() => showForm()}><span aria-hidden="true">＋</span> Add a task</button>
          </div>

          <div className="list-toolbar">
            <div className="filter-tabs" role="tablist" aria-label="Filter tasks">
              {filters.map((item) => <button key={item} type="button" role="tab" aria-selected={filter === item} className={filter === item ? 'filter-tab selected' : 'filter-tab'} onClick={() => setFilter(item)}>{item === 'all' ? 'All tasks' : item === 'open' ? 'In progress' : 'Completed'}</button>)}
            </div>
            <span className="list-sort">PRIORITY <span aria-hidden="true">↕</span></span>
          </div>

          {actionError && !formOpen && <div className="notice notice-error" role="alert"><span>{actionError}</span><button type="button" onClick={() => setActionError('')} aria-label="Dismiss error">×</button></div>}
          {loadError && <div className="notice notice-error" role="alert"><span>Couldn’t load your tasks: {loadError}</span><button className="retry-button" type="button" onClick={loadTodos}>Try again</button></div>}
          {loading ? (
            <div className="loading-state" role="status"><span className="loader" /> Getting your tasks…</div>
          ) : loadError ? null : visibleTodos.length ? (
            <TodoList
              todos={visibleTodos}
              onToggle={(todo) => changeTodo(todo, { completed: !todo.completed })}
              onPriorityChange={(todo, priority) => changeTodo(todo, { priority })}
              onEdit={showForm}
              onDelete={removeTodo}
            />
          ) : (
            <div className="empty-state">
              <div className="empty-icon" aria-hidden="true">{filter === 'completed' ? '✓' : '✳'}</div>
              <h3>{hasTodos ? 'Nothing in this view' : 'A fresh page.'}</h3>
              <p>{hasTodos ? 'Try another filter to find the task you’re looking for.' : 'Add your first task and give your day a little direction.'}</p>
              {!hasTodos && <button className="button button-primary" type="button" onClick={() => showForm()}>Create your first task <span aria-hidden="true">→</span></button>}
            </div>
          )}
          {!loading && !loadError && visibleTodos.length > 0 && <p className="list-footer">Showing {visibleTodos.length} {visibleTodos.length === 1 ? 'task' : 'tasks'} <span>·</span> Keep going at your own pace.</p>}
        </section>

        <footer className="page-footer"><span>DAYMARK <span className="brand-period">●</span></span><span>A little progress is still progress.</span></footer>
      </main>

      {formOpen && <TodoForm todo={formTodo} onSubmit={saveTodo} onCancel={() => { setFormOpen(false); setFormTodo(null); }} saving={saving} error={actionError} />}
    </div>
  );
}
