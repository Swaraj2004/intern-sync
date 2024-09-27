import * as z from 'zod';

export const collegeMentorProfileFormSchema = z.object({
  fullName: z
    .string({
      required_error: 'Full name is required.',
    })
    .min(2, { message: 'Full name is required.' }),
  email: z
    .string()
    .min(1, { message: 'Email address is required.' })
    .email({ message: 'Invalid email address.' }),
  contact: z
    .string({
      required_error: 'Contact number is required.',
    })
    .min(10, { message: 'Contact number should be 10 digits.' })
    .max(10, { message: 'Contact number should be 10 digits.' }),
  departmentName: z
    .string({
      required_error: 'Department name is required.',
    })
    .min(2, { message: 'Department name is required.' }),
  instituteName: z
    .string({
      required_error: 'Institute name is required.',
    })
    .min(2, { message: 'Institute name is required.' }),
});
