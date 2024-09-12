import { ChevronsUpDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';
import { cn } from '@/lib/utils';

const SelectInputSkeleton = ({
  label,
  noLabel,
  placeholder,
  className,
}: {
  label: string;
  noLabel?: boolean;
  placeholder?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'w-full flex flex-col space-y-2',
        noLabel && 'space-y-0',
        className
      )}
    >
      <FormLabel className={`h-4 my-1 ${noLabel ? 'sr-only' : ''}`}>
        {label}
      </FormLabel>
      <Button
        variant="outline"
        className="px-3 justify-between border-2 focus:outline-none focus:border-primary disabled:pointer-events-auto disabled:cursor-not-allowed opacity-50"
        disabled
      >
        {placeholder || (noLabel && label)}
        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </div>
  );
};

export default SelectInputSkeleton;
