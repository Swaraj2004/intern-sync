import * as z from 'zod';

const registrationFormSchema = z
  .object({
    instituteName: z
      .string({
        required_error: 'Institute name is required.',
      })
      .min(3, { message: 'Institute name is required.' }),
    aicteId: z
      .string({
        required_error: 'AICTE ID is required.',
      })
      .min(1, { message: 'AICTE ID is required.' }),
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
        path: ['password'],
      });
    }
  });
export default registrationFormSchema;
