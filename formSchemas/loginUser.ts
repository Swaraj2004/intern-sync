import * as z from 'zod';

const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email address is required.' })
    .email({ message: 'Invalid email address.' }),
  password: z
    .string({
      required_error: 'Password is required.',
    })
    .min(6, { message: 'Atleast 6 characters required.' }),
});

export default loginFormSchema;
