import * as z from 'zod';

const registrationFormSchema = z
  .object({
    fullName: z
      .string({
        required_error: 'User full name is required.',
      })
      .min(3, { message: 'User full name is required.' }),
    email: z
      .string()
      .min(1, { message: 'Email address is required.' })
      .email({ message: 'Invalid email address.' }),
    password: z
      .string({
        required_error: 'Password is required.',
      })
      .min(6, { message: 'Atlest 6 characters required.' }),
    confirmPassword: z
      .string({
        required_error: 'Confirm Password is required.',
      })
      .min(6, { message: 'Atlest 6 characters required.' }),
  })
  .superRefine(({ password, confirmPassword }, refinementContext) => {
    if (password !== confirmPassword) {
      return refinementContext.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
      });
    }
  });
export default registrationFormSchema;
