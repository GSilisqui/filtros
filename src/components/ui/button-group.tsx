import { cn } from '@/lib/utils';

interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function ButtonGroup({ children, className }: ButtonGroupProps) {
  return (
    <div
      data-slot="button-group"
      className={cn('flex items-center', className)}
    >
      {children}
    </div>
  );
}
