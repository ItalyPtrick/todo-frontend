import apiClient from '../../services/api-client';
import type { Todo, CreateTodoInput, UpdateTodoInput, TodoStats, TodoFilters } from './types';

export async function getTodos(params?: TodoFilters): Promise<Todo[]> {
  const response = await apiClient.get('/todos/', { params });
  return response.data;
}

export async function createTodo(data: CreateTodoInput): Promise<Todo> {
  const response = await apiClient.post('/todos/', data);
  return response.data;
}

export async function updateTodo(id: string, data: UpdateTodoInput): Promise<Todo> {
  const response = await apiClient.put(`/todos/${id}`, data);
  return response.data;
}

export async function deleteTodo(id: string): Promise<void> {
  await apiClient.delete(`/todos/${id}`);
}

export async function getStats(): Promise<TodoStats> {
  const response = await apiClient.get('/todos/stats');
  return response.data;
}
