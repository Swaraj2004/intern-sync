import * as z from 'zod';

const registrationFormSchema = z
  .object({
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
    location: z
      .string()
      .min(1, { message: 'Location is required.' })
      .max(50, { message: 'Location is too long.' }),
    email: z
      .string()
      .min(1, { message: 'Email address is required.' })
      .email({ message: 'Invalid email address.' }),
    password: z
      .string({
        required_error: 'Password is required.',
      })
      .min(6, { message: 'Atlest 6 characters required.' }),
    confirm_password: z
      .string({
        required_error: 'Confirm Password is required.',
      })
      .min(6, { message: 'Atlest 6 characters required.' }),
  })
  .superRefine(({ password, confirm_password }, refinementContext) => {
    if (password !== confirm_password) {
      return refinementContext.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match.',
        path: ['password'],
      });
    }
  });
export default registrationFormSchema;
