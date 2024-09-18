import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type SingleSelectInputProps = {
  label: string;
  noLabel?: boolean;
  placeholder?: string;
  id: string;
  options: {
    label: string;
    value: string;
  }[];
  form: any;
  triggerClassName?: string;
  contentClassName?: string;
  formItemClassName?: string;
};

const SingleSelectInput = ({
  label,
  noLabel,
  placeholder,
  id,
  options,
  form,
  triggerClassName,
  contentClassName,
  formItemClassName,
}: SingleSelectInputProps) => {
  return (
    <FormField
      control={form.control}
      name={id}
      render={({ field }) => (
        <FormItem className={cn('w-full', formItemClassName)}>
          <FormLabel className={`h-4 my-1 ${noLabel ? 'sr-only' : ''}`}>
            {label}
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className={triggerClassName}>
                <SelectValue placeholder={placeholder || (noLabel && label)} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className={contentClassName}>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SingleSelectInput;
