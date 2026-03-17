import { motion } from 'framer-motion';
import { format, isPast, parseISO } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Button } from '../../../components/ui/button';
import { PriorityBadge } from './PriorityBadge';
import type { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onUpdateStatus: (todoId: string, completed: boolean) => void;
  onDelete: (todoId: string) => void;
  onRefresh: () => void;
}

export function TodoItem({ todo, onEdit, onUpdateStatus, onDelete, onRefresh }: TodoItemProps) {
  const handleToggleComplete = () => {
    onUpdateStatus(todo.id, !todo.completed);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const isOverdue = todo.due_date && !todo.completed && isPast(parseISO(todo.due_date));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: todo.completed ? 0.98 : 1,
        backgroundColor: todo.completed ? 'rgba(123, 156, 196, 0.08)' : 'rgba(22, 33, 55, 1)',
      }}
      transition={{
        layout: { duration: 0.2 },
        opacity: { duration: 0.2 },
        y: { duration: 0.2 },
        scale: { type: 'spring', stiffness: 400, damping: 25 },
        backgroundColor: { duration: 0.2 },
      }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card group cursor-pointer"
      onClick={(e) => {
        // 点击整行也可以切换完成状态，但排除按钮点击
        if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.task-content')) {
          handleToggleComplete();
        }
      }}
    >
      {/* 左侧 Checkbox - 带动画 */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          handleToggleComplete();
        }}
        className="shrink-0 w-6 h-6 rounded border-2 border-primary flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={todo.completed ? '标记为未完成' : '标记为已完成'}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          initial={false}
          animate={{
            scale: todo.completed ? 1 : 0,
            opacity: todo.completed ? 1 : 0,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="w-4 h-4"
        >
          <svg
            className="w-4 h-4 text-primary-foreground"
            viewBox="0 0 24 24"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: todo.completed ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
      </motion.button>

      {/* 中间内容 */}
      <div className="flex-1 min-w-0 task-content">
        <div className="flex items-center gap-2 flex-wrap">
          <motion.span
            className="font-medium"
            animate={{
              textDecorationLine: todo.completed ? 'line-through' : 'none',
              opacity: todo.completed ? 0.5 : 1,
              color: todo.completed ? '#7B9CC4' : '#F0F9FF',
            }}
            transition={{ duration: 0.25 }}
          >
            {todo.title}
          </motion.span>
          <PriorityBadge priority={todo.priority} />
        </div>
        {todo.due_date && (
          <motion.p
            className="text-sm mt-1"
            animate={{
              opacity: todo.completed ? 0.4 : (isOverdue ? 1 : 0.7),
            }}
            transition={{ duration: 0.2 }}
            style={{ color: isOverdue && !todo.completed ? '#FF6B4A' : '#7B9CC4' }}
          >
            {format(parseISO(todo.due_date), 'yyyy-MM-dd')}
            {isOverdue && ' (已过期)'}
          </motion.p>
        )}
      </div>

      {/* 右侧操作菜单 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(todo)}>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            编辑
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
