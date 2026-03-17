import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ListTodo, CheckCircle, Circle } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import { Skeleton } from '../../../components/ui/skeleton';
import { fadeUp, staggerContainer } from '../../../lib/animations';
import apiClient from '../../../services/api-client';

interface TodoStatsData {
  total: number;
  completed: number;
  uncompleted: number;
}

interface TodoStatsProps {
  refreshTrigger?: number;
}

export function TodoStats({ refreshTrigger = 0 }: TodoStatsProps) {
  const [stats, setStats] = useState<TodoStatsData | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const fetchStats = async () => {
      // 只有首次加载才显示 loading
      if (isFirstLoad.current) {
        setInitialLoading(true);
      }
      try {
        const response = await apiClient.get('/todos/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        if (isFirstLoad.current) {
          setInitialLoading(false);
          isFirstLoad.current = false;
        }
      }
    };

    fetchStats();
  }, [refreshTrigger]);

  // 首次加载显示 Skeleton
  if (initialLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  const statItems = [
    {
      title: '总任务',
      value: stats?.total || 0,
      icon: ListTodo,
      color: 'text-foreground',
    },
    {
      title: '已完成',
      value: stats?.completed || 0,
      icon: CheckCircle,
      color: 'text-accent',
    },
    {
      title: '未完成',
      value: stats?.uncompleted || 0,
      icon: Circle,
      color: 'text-[#FF6B4A]',
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-3 gap-4"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {statItems.map((item) => (
        <motion.div key={item.title} variants={fadeUp}>
          <Card className="bg-card border border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <item.icon className="w-8 h-8 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">{item.title}</p>
                <p className={`text-3xl font-bold ${item.color}`}>
                  {item.value}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
