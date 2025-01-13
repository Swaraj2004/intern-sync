import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import React from 'react';

type InputBoxProps = {
  id: string;
  type: string;
  label: string;
  noLabel?: boolean;
  placeholder?: string;
  disabled?: boolean;
  description?: React.ReactNode;
  form: any;
  className?: string;
};

const InputBox = ({
  id,
  type,
  label,
  noLabel,
  placeholder,
  disabled,
  description,
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
              disabled={disabled || false}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
              className={className}
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputBox;
