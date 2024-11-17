'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import InputBox from '@/components/ui/InputBox';
import { useUser } from '@/context/UserContext';
import addDepartmentFormSchema from '@/formSchemas/addDepartment';
import { useAddDepartment } from '@/services/mutations/departments';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const AddDepartmentForm = () => {
  const { user, instituteId } = useUser();
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const form = useForm<z.infer<typeof addDepartmentFormSchema>>({
    resolver: zodResolver(addDepartmentFormSchema),
    defaultValues: {
      departmentName: '',
      departmentCoordinatorName: '',
      email: '',
      sendInvite: true,
    },
  });

  const { addDepartment } = useAddDepartment({
    instituteId: instituteId!,
    userId: user?.uid!,
  });

  const handleAddRole = async (
    values: z.infer<typeof addDepartmentFormSchema>
  ) => {
    const { departmentName, departmentCoordinatorName, email, sendInvite } =
      values;
    setOpenAddDialog(false);

    await addDepartment(
      departmentName.trim(),
      departmentCoordinatorName.trim(),
      email.trim(),
      sendInvite
    );
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
          <DialogTitle>Add New Department</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddRole)}>
            <div className="pb-5 space-y-3">
              <InputBox
                label="Name"
                placeholder="Enter department name"
                id="departmentName"
                type="text"
                form={form}
              />
              <InputBox
                label="Department Coordinator"
                placeholder="Enter coordinator's full name"
                id="departmentCoordinatorName"
                type="text"
                form={form}
              />
              <InputBox
                label="Email"
                placeholder="Enter email"
                id="email"
                type="email"
                form={form}
              />
              <FormField
                control={form.control}
                name="sendInvite"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border-2 p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Send an invite email</FormLabel>
                      <FormDescription>
                        The department registers via the invite email, which can
                        be sent later too. If the user is already registered,
                        the role is assigned directly without another email.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button>Add Department</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDepartmentForm;
