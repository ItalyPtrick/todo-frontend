import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '../../../components/ui/skeleton';
import { TodoItem } from './TodoItem';
import type { Todo } from '../types';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  onEdit: (todo: Todo) => void;
  onUpdateStatus: (todoId: string, completed: boolean) => void;
  onDelete: (todoId: string) => void;
  onRefresh: () => void;
}

export function TodoList({
  todos,
  loading,
  onEdit,
  onUpdateStatus,
  onDelete,
  onRefresh,
}: TodoListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 text-muted-foreground"
      >
        <svg
          className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
        <p>暂无任务，点击右上角新建</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-3"
      initial="initial"
      animate="animate"
    >
      <AnimatePresence mode="popLayout">
        {todos.map((todo, index) => (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ 
              delay: index * 0.05,
              duration: 0.2,
            }}
            layout
          >
            <TodoItem
              todo={todo}
              onEdit={onEdit}
              onUpdateStatus={onUpdateStatus}
              onDelete={onDelete}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
