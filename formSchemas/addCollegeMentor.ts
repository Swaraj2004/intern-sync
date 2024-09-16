import * as z from 'zod';

const addCollegeMentorByInstituteFormSchema = z.object({
  collegeMentorName: z
    .string({
      required_error: 'College mentor name is required.',
    })
    .min(2, { message: 'College mentor name is required.' }),
  email: z
    .string()
    .min(1, { message: 'Email address is required.' })
    .email({ message: 'Invalid email address.' }),
  departmentId: z.string({
    required_error: 'Department is required.',
  }),
  sendInvite: z.boolean(),
});

const addCollegeMentorByDepartmentFormSchema = z.object({
  collegeMentorName: z
    .string({
      required_error: 'College mentor name is required.',
    })
    .min(2, { message: 'College mentor name is required.' }),
  email: z
    .string()
    .min(1, { message: 'Email address is required.' })
    .email({ message: 'Invalid email address.' }),
  sendInvite: z.boolean(),
});

export {
  addCollegeMentorByInstituteFormSchema,
  addCollegeMentorByDepartmentFormSchema,
};
