import * as z from 'zod';

export const studentProfileFormSchema = z.object({
  fullName: z
    .string({
      required_error: 'Full name is required.',
    })
    .min(2, { message: 'Full name is required.' }),
  email: z
    .string()
    .min(1, { message: 'Email address is required.' })
    .email({ message: 'Invalid email address.' }),
  dob: z.date({
    required_error: 'Date of birth is required.',
  }),
  contact: z
    .string({
      required_error: 'Contact number is required.',
    })
    .min(10, { message: 'Contact number should be 10 digits.' })
    .max(10, { message: 'Contact number should be 10 digits.' }),
  address: z
    .string({
      required_error: 'Address is required.',
    })
    .min(2, { message: 'Address is required.' }),
  admissionYear: z
    .string({
      required_error: 'Admission year is required.',
    })
    .min(4, { message: 'Admission year should be of 4 digits.' })
    .max(4, { message: 'Admission year should be of 4 digits.' }),
  division: z
    .string({
      required_error: 'Division is required.',
    })
    .min(1, { message: 'Division should be 1 character only.' })
    .max(1, { message: 'Division should be 1 character only.' }),
  rollNumber: z
    .string({
      required_error: 'Roll number is required.',
    })
    .min(1, { message: 'Roll number is required.' }),
  admissionId: z
    .string({
      required_error: 'Admission ID is required.',
    })
    .min(1, { message: 'Admission ID is required.' }),
  departmentName: z
    .string({
      required_error: 'Department name is required.',
    })
    .min(2, { message: 'Department name is required.' }),
  instituteName: z
    .string({
      required_error: 'Institute name is required.',
    })
    .min(2, { message: 'Institute name is required.' }),
  collegeMentorName: z.string().optional(),
  companyMentorName: z.string().optional(),
});
