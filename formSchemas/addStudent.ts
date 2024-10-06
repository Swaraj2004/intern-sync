import * as z from 'zod';

const addStudentByInstituteFormSchema = z.object({
  studentName: z
    .string({
      required_error: 'College mentor name is required.',
    })
    .min(2, { message: 'College mentor name is required.' }),
  email: z
    .string()
    .min(1, { message: 'Email address is required.' })
    .email({ message: 'Invalid email address.' }),
  departmentId: z.string().min(1, { message: 'Department is required.' }),
  collegeMentorId: z.string().optional(),
  sendInvite: z.boolean(),
});

const addStudentByDepartmentFormSchema = z.object({
  studentName: z
    .string({
      required_error: 'College mentor name is required.',
    })
    .min(2, { message: 'College mentor name is required.' }),
  email: z
    .string()
    .min(1, { message: 'Email address is required.' })
    .email({ message: 'Invalid email address.' }),
  collegeMentorId: z.string().optional(),
  sendInvite: z.boolean(),
});

export { addStudentByDepartmentFormSchema, addStudentByInstituteFormSchema };
