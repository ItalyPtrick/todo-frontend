import { Badge } from '../../../components/ui/badge';

interface PriorityBadgeProps {
  priority: number;
}

const priorityConfig: Record<number, { label: string; color: string; bgColor: string }> = {
  1: { label: '低', color: '#7B9CC4', bgColor: '#0D1F35' },
  2: { label: '中', color: '#1EB1ED', bgColor: '#072A3F' },
  3: { label: '高', color: '#FF6B4A', bgColor: '#3D1A10' },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority] || priorityConfig[1];

  return (
    <Badge
      variant="secondary"
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
        border: 'none',
      }}
    >
      {config.label}
    </Badge>
  );
}
