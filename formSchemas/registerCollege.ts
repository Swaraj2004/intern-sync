import * as z from 'zod';

const registrationFormSchema = z.object({
  instituteId: z
    .string({
      required_error: 'Institute ID is required.',
    })
    .min(1, { message: 'Institute ID is required.' }),
  instituteName: z
    .string({
      required_error: 'Institute name is required.',
    })
    .min(3, { message: 'Institute name is required.' }),
  email: z
    .string()
    .min(1, { message: 'Email address is required.' })
    .email({ message: 'Invalid email address.' }),
  password: z
    .string({
      required_error: 'Password is required.',
    })
    .min(6, { message: 'Atlest 6 characters required.' }),
});

export default registrationFormSchema;
