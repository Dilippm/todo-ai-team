import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const getTodos = async () => (await api.get('/todos')).data;
export const createTodo = async (todo) => (await api.post('/todos', todo)).data;
export const updateTodo = async (id, updates) => (await api.put(`/todos/${id}`, updates)).data;
export const deleteTodo = async (id) => api.delete(`/todos/${id}`);

export function getApiError(error) {
  return error.response?.data?.error || error.message || 'Something went wrong. Please try again.';
}
