import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CommandList } from 'cmdk';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useState } from 'react';

type SearchInputProps = {
  label: string;
  noLabel?: boolean;
  placeholder?: string;
  id: string;
  options: {
    label: string;
    value: string;
  }[];
  form: any;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
};

const SearchInput = ({
  label,
  noLabel,
  placeholder,
  id,
  options,
  form,
  onValueChange,
  disabled = false,
}: SearchInputProps) => {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={form.control}
      name={id}
      render={({ field }) => (
        <FormItem
          className={`w-full flex flex-col ${
            noLabel ? 'space-y-0' : 'space-y-2'
          }`}
        >
          <FormLabel className={`h-4 my-1 ${noLabel ? 'sr-only' : ''}`}>
            {label}
          </FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'px-3 justify-between border-2 focus:outline-none focus:border-primary',
                    !field.value && 'text-muted-foreground',
                    disabled &&
                      ' disabled:pointer-events-auto disabled:cursor-not-allowed opacity-50'
                  )}
                  disabled={disabled}
                >
                  {field.value
                    ? options.find((option) => option.value === field.value)
                        ?.label
                    : `${placeholder || (noLabel && label)}`}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="sm:w-[375px] p-0">
              <Command>
                <CommandInput
                  placeholder={`Search ${label.toLowerCase()}...`}
                  disabled={disabled}
                />
                <CommandEmpty>{`No ${label.toLowerCase()} found.`}</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        value={option.label}
                        key={option.value}
                        onSelect={() => {
                          form.setValue(id, option.value);
                          onValueChange?.(option.value);
                          setOpen(false);
                        }}
                        disabled={disabled}
                      >
                        <CheckIcon
                          className={cn(
                            'mr-2 h-4 w-4',
                            option.value === field.value
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SearchInput;
