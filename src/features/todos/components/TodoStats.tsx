import { motion } from 'framer-motion';
import { ListTodo, CheckCircle, Circle } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import { fadeUp, staggerContainer } from '../../../lib/animations';

interface Stats {
  total: number;
  completed: number;
  uncompleted: number;
}

interface TodoStatsProps {
  stats: Stats;
}

// 数字动画组件
function AnimatedNumber({ value, color }: { value: number; color: string }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0.5, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.2,
        ease: 'easeOut',
      }}
      className={`text-3xl font-bold ${color}`}
    >
      {value}
    </motion.span>
  );
}

export function TodoStats({ stats }: TodoStatsProps) {
  const statItems = [
    {
      title: '总任务',
      value: stats.total,
      icon: ListTodo,
      color: 'text-foreground',
    },
    {
      title: '已完成',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-accent',
    },
    {
      title: '未完成',
      value: stats.uncompleted,
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
                <AnimatedNumber value={item.value} color={item.color} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
