import * as z from 'zod';

const setPasswordFormSchema = z
  .object({
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

export default setPasswordFormSchema;
