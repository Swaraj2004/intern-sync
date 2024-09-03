import * as z from 'zod';

const addDepartmentFormSchema = z.object({
  departmentName: z
    .string({
      required_error: 'Department name is required.',
    })
    .min(2, { message: 'Department name is required.' }),
  departmentCoordinatorName: z
    .string({
      required_error: 'Department coordinator full name is required.',
    })
    .min(3, { message: 'Department coordinator full name is required.' }),
  email: z
    .string()
    .min(1, { message: 'Email address is required.' })
    .email({ message: 'Invalid email address.' }),
  sendInvite: z.boolean(),
});

export default addDepartmentFormSchema;
