import * as z from 'zod';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
];

const currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);

export const addInternshipFormSchema = z
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
    region: z
      .string({
        required_error: 'Region is required.',
      })
      .min(2, { message: 'Region is required.' }),
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
    internshipLetter: z
      .any()
      .refine(
        (files) => files?.length !== 0,
        'Please upload internship letter.'
      )
      .refine(
        (files) => files?.[0]?.size <= MAX_FILE_SIZE,
        `Max file size is 2MB.`
      )
      .refine(
        (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
        'Only .jpg, .jpeg, .png and .pdf files are accepted.'
      ),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'End date must be greater than start date.',
    path: ['endDate'],
  })
  .refine((data) => data.endDate >= currentDate, {
    message: 'End date cannot be in the past.',
    path: ['endDate'],
  });

export default addInternshipFormSchema;
