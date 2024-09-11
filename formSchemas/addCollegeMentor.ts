import * as z from 'zod';

const addCollegeMentorFormSchema = z.object({
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
  contact: z.bigint().optional(),
  dob: z.date().optional(),
  sendInvite: z.boolean(),
});

export default addCollegeMentorFormSchema;
