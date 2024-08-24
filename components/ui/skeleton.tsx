import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-input/60 dark:bg-muted-foreground/50',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };