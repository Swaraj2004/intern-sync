import * as z from 'zod';

export const instituteProfileFormSchema = z.object({
  fullName: z
    .string({
      required_error: 'Full name is required.',
    })
    .min(2, { message: 'Full name is required.' }),
  email: z
    .string()
    .min(1, { message: 'Email address is required.' })
    .email({ message: 'Invalid email address.' }),
  contact: z.string().optional(),
  instituteName: z
    .string({
      required_error: 'Institute name is required.',
    })
    .min(2, { message: 'Institute name is required.' }),
  instituteAddress: z
    .string({
      required_error: 'Institute address is required.',
    })
    .min(3, { message: 'Institute address is required.' }),
  instituteEmailDomain: z
    .string({
      required_error: 'Institute email domain is required.',
    })
    .min(2, { message: 'Institute email domain is required.' }),
  studentEmailDomain: z
    .string({
      required_error: 'Student email domain is required.',
    })
    .min(2, { message: 'Student email domain is required.' }),
});
