'use client';

import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import InputBox from '@/components/ui/InputBox';
import { useUser } from '@/context/UserContext';
import { formatDateForInput } from '@/lib/utils';
import { useAddEvaluation } from '@/services/mutations/evaluations';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required.',
    })
    .min(2, { message: 'Name is required.' }),
  date: z.date({
    required_error: 'Date is required.',
  }),
});

const AddEvaluationForm = () => {
  const { user, instituteId } = useUser();
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      date: undefined,
    },
  });

  const { addEvaluation } = useAddEvaluation({
    instituteId: instituteId!,
    departmentId: user?.uid,
  });

  const handleAddEvaluation = async (values: z.infer<typeof FormSchema>) => {
    const { name, date } = values;
    setOpenAddDialog(false);

    await addEvaluation(name, formatDateForInput(date));
  };

  return (
    <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="h-5 w-5 mr-2" />
          <span className="pr-1">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="w-[calc(100vw-24px)] min-[450px]:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Add New Evaluation</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddEvaluation)}>
            <div className="pb-5 space-y-3">
              <InputBox
                label="Name"
                placeholder="Enter evaluation name"
                id="name"
                type="text"
                form={form}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="date">Date</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        jsDate={field.value}
                        onJsDateChange={field.onChange}
                        aria-label="Date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Add Evaluation</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEvaluationForm;
