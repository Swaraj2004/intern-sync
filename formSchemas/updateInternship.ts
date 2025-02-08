import * as z from 'zod';

const currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);

export const updateInternshipFormSchema = z
  .object({
    role: z
      .string({
        required_error: 'Role is required.',
      })
      .min(2, { message: 'Role is required.' }),
    field: z
      .string({
        required_error: 'Field is required.',
      })
      .min(2, { message: 'Field is required.' }),
    mode: z
      .string({
        required_error: 'Mode is required.',
      })
      .min(2, { message: 'Mode is required.' }),
    startDate: z.date({
      required_error: 'Start date is required.',
    }),
    endDate: z.date({
      required_error: 'End date is required.',
    }),
    companyMentorEmail: z.string().optional(),
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
    homeCoordinates: z.string().optional(),
    homeRadius: z.string().optional(),
    companyCoordinates: z.string().optional(),
    companyRadius: z.string().optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'End date must be greater than start date.',
    path: ['endDate'],
  })
  .refine((data) => data.endDate >= currentDate, {
    message: 'End date cannot be in the past.',
    path: ['endDate'],
  });

export default updateInternshipFormSchema;
