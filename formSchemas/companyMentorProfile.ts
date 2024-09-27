import * as z from 'zod';

export const companyMentorProfileFormSchema = z.object({
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
  designation: z
    .string({
      required_error: 'Designation is required.',
    })
    .min(2, { message: 'Designation is required.' }),
  companyName: z
    .string({
      required_error: 'Company name is required.',
    })
    .min(2, { message: 'Company name is required.' }),
  companyAddress: z
    .string({
      required_error: 'Company address is required.',
    })
    .min(2, { message: 'Company address is required.' }),
});
