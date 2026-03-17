import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '../components/ui/sheet';
import { Label } from '../components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { ListTodo, CheckCircle, Circle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Calendar } from '../components/ui/calendar';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { TodoList } from '../features/todos/components/TodoList';
import { createTodo, updateTodo, getTodos } from '../features/todos/api';
import type { Todo, CreateTodoInput, UpdateTodoInput } from '../features/todos/types';

export function TodosPage() {
  // Todos 状态
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  // Sheet 状态
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // 表单状态
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('1');
  const [dueDate, setDueDate] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // 筛选排序状态
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 获取任务列表
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (filterPriority && filterPriority !== 'all') params.priority = parseInt(filterPriority, 10);
      if (sortBy) params.sort_by = sortBy;
      if (sortOrder) params.order = sortOrder;

      const data = await getTodos(params);
      setTodos(data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filterPriority, sortBy, sortOrder]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // 计算统计数据（本地计算，立即更新）
  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    uncompleted: todos.filter(t => !t.completed).length,
  };

  // 打开新建 Sheet
  const handleOpenCreate = () => {
    setEditingTodo(null);
    setTitle('');
    setPriority('1');
    setDueDate('');
    setSelectedDate(undefined);
    setSheetOpen(true);
  };

  // 打开编辑 Sheet
  const handleOpenEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setPriority(todo.priority.toString());
    setDueDate(todo.due_date ? todo.due_date.split('T')[0] : '');
    setSelectedDate(todo.due_date ? new Date(todo.due_date) : undefined);
    setSheetOpen(true);
  };

  // 关闭 Sheet
  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingTodo(null);
  };

  // 保存任务
  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('请输入任务标题');
      return;
    }

    try {
      const data: CreateTodoInput | UpdateTodoInput = {
        title: title.trim(),
        priority: parseInt(priority, 10),
        due_date: dueDate || undefined,
      };

      if (editingTodo) {
        await updateTodo(editingTodo.id, data);
        toast.success('任务已更新');
      } else {
        await createTodo(data as CreateTodoInput);
        toast.success('任务已创建');
      }

      handleCloseSheet();
      fetchTodos();
    } catch (error) {
      toast.error(editingTodo ? '更新任务失败' : '创建任务失败');
    }
  };

  // 更新单个任务状态（本地乐观更新）
  const handleUpdateTodoStatus = async (todoId: string, completed: boolean) => {
    // 立即本地更新
    setTodos(prev => prev.map(t =>
      t.id === todoId ? { ...t, completed } : t
    ));

    try {
      await updateTodo(todoId, { completed });
    } catch (error) {
      // 失败则回滚
      setTodos(prev => prev.map(t =>
        t.id === todoId ? { ...t, completed: !completed } : t
      ));
      toast.error('更新任务状态失败');
    }
  };

  // 删除任务
  const handleDeleteTodo = async (todoId: string) => {
    setTodos(prev => prev.filter(t => t.id !== todoId));
    try {
      const { deleteTodo } = await import('../features/todos/api');
      await deleteTodo(todoId);
      toast.success('任务已删除');
    } catch (error) {
      fetchTodos();
      toast.error('删除任务失败');
    }
  };

  // 刷新列表
  const handleRefresh = () => {
    fetchTodos();
  };

  const statItems = [
    { title: '总任务', value: stats.total, icon: ListTodo, color: 'text-foreground' },
    { title: '已完成', value: stats.completed, icon: CheckCircle, color: 'text-accent' },
    { title: '未完成', value: stats.uncompleted, icon: Circle, color: 'text-[#FF6B4A]' },
  ];

  return (
    <div className="p-8">
      {/* 顶部栏 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">我的任务</h1>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" />
          新建任务
        </Button>
      </div>

      {/* 统计卡片 - 带动画 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {statItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-card border border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <item.icon className="w-8 h-8 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                  <AnimatePresence mode="popLayout">
                    <motion.p
                      key={item.value}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`text-3xl font-bold ${item.color}`}
                    >
                      {item.value}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 工具栏 */}
      <div className="flex flex-wrap gap-3 my-4">
        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索任务..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-9"
          />
        </div>

        {/* 优先级筛选 */}
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="全部优先级" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部优先级</SelectItem>
            <SelectItem value="3">高</SelectItem>
            <SelectItem value="2">中</SelectItem>
            <SelectItem value="1">低</SelectItem>
          </SelectContent>
        </Select>

        {/* 排序 */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="排序方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">创建时间</SelectItem>
            <SelectItem value="priority">优先级</SelectItem>
            <SelectItem value="due_date">截止日期</SelectItem>
          </SelectContent>
        </Select>

        {/* 排序方向 */}
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-28">
            <SelectValue placeholder="排序方向" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">降序</SelectItem>
            <SelectItem value="asc">升序</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 任务列表 */}
      <TodoList
        todos={todos}
        loading={loading}
        onEdit={handleOpenEdit}
        onUpdateStatus={handleUpdateTodoStatus}
        onDelete={handleDeleteTodo}
        onRefresh={handleRefresh}
        search={debouncedSearch}
        priority={filterPriority}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />

      {/* 新建/编辑 Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editingTodo ? '编辑任务' : '新建任务'}</SheetTitle>
          </SheetHeader>

          <div className="space-y-4 py-4">
            {/* 标题 */}
            <div className="space-y-2">
              <Label htmlFor="title">任务标题</Label>
              <Input
                id="title"
                placeholder="请输入任务标题"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* 优先级 */}
            <div className="space-y-2">
              <Label htmlFor="priority">优先级</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="选择优先级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">低</SelectItem>
                  <SelectItem value="2">中</SelectItem>
                  <SelectItem value="3">高</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 截止日期 */}
            <div className="space-y-2">
              <Label>截止日期（可选）</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, 'yyyy年MM月dd日', { locale: zhCN })
                    ) : (
                      <span className="text-muted-foreground">选择截止日期</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-lg" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setDueDate(date ? format(date, 'yyyy-MM-dd') : '');
                    }}
                    locale={zhCN}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                    className="rounded-lg"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={handleCloseSheet}>
              取消
            </Button>
            <Button onClick={handleSave}>
              保存
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
