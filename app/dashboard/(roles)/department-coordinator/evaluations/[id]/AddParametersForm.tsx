'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import InputBox from '@/components/ui/InputBox';
import SingleSelectInput from '@/components/ui/SelectInput';
import { useAddParameter } from '@/services/mutations/parameters';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const roleOptions = [
  { value: 'student', label: 'Student' },
  { value: 'college-mentor', label: 'Evaluator' },
];

const FormSchema = z.object({
  name: z
    .string({
      required_error: 'Text is required.',
    })
    .min(2, { message: 'Text must be at least 2 characters.' }),
  role: z.string({
    required_error: 'Role is required.',
  }),
});

interface AddParameterFormProps {
  evalId: string; // Receive evalId as a prop
  onParameterAdded: () => void; // Optional callback for when a parameter is added
}

const AddParameterForm: React.FC<AddParameterFormProps> = ({
  evalId,
  onParameterAdded,
}) => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      role: '',
    },
  });

  const { addParameter } = useAddParameter(evalId);

  const handleAddParameter = async (values: z.infer<typeof FormSchema>) => {
    const { name, role } = values;
    await addParameter(name, role);
    setOpenAddDialog(false);
    if (onParameterAdded) {
      onParameterAdded();
    }
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
          <DialogTitle>Add New Parameter</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddParameter)}>
            <div className="pb-5 space-y-3">
              <InputBox
                label="Name"
                placeholder="Enter parameter text"
                id="name"
                type="text"
                form={form}
              />
              <SingleSelectInput
                label="Role"
                placeholder="Enter parameter role"
                id="role"
                options={roleOptions}
                form={form}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Add Parameter</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddParameterForm;
