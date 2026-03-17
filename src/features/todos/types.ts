export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: number;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  owner_id: string;
}

export interface CreateTodoInput {
  title: string;
  priority: number;
  due_date?: string;
}

export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
  priority?: number;
  due_date?: string;
}

export interface TodoStats {
  total: number;
  completed: number;
  uncompleted: number;
}

export interface TodoFilters {
  completed?: boolean;
  priority?: number;
  search?: string;
  sort_by?: 'created_at' | 'updated_at' | 'due_date' | 'priority';
  order?: 'asc' | 'desc';
}
