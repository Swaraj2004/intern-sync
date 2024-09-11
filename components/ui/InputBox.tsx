import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type InputBoxProps = {
  label: string;
  noLabel?: boolean;
  placeholder?: string;
  id: string;
  type: string;
  form: any;
  className?: string;
};

const InputBox = ({
  label,
  noLabel,
  placeholder,
  id,
  type,
  form,
  className,
}: InputBoxProps) => {
  return (
    <FormField
      control={form.control}
      name={id}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel className={`${noLabel ? 'sr-only' : ''}`}>
            {label}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder || label}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
              className={className}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputBox;
