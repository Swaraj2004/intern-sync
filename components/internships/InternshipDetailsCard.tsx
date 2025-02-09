'use client';

import InternshipLetterCell from '@/components/internships/InternshipLetterCell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import InputBox from '@/components/ui/InputBox';
import { Textarea } from '@/components/ui/textarea';
import { formatDateForDisplay } from '@/lib/utils';
import {
  useAddHomeCoordinates,
  useAssignCompanyMentor,
} from '@/services/mutations/internships';
import InternshipDetails from '@/types/internship-details';
import { supabaseClient } from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const setCoordinatesFormSchema = z.object({
  coordinates: z.string().min(2, 'Please enter valid coordinates.'),
  radius: z.coerce
    .number({
      message: 'Please enter a valid radius.',
    })
    .int()
    .gte(10, 'Please enter a valid radius.'),
});

const sendEmailFormSchema = z.object({
  subject: z.string({
    required_error: 'Subject is required.',
  }),
  body: z.string({
    required_error: 'Body is required.',
  }),
});

const InternshipDetailsCard = ({
  internshipDetails,
  internshipId,
}: {
  internshipDetails: InternshipDetails;
  internshipId: string;
}) => {
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [openCoordinatesDialog, setOpenCoordinatesDialog] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [companyMentorStatus, setCompanyMentorStatus] = useState<
    'loading' | 'not-found' | 'company-mentor' | 'error' | 'no-email'
  >('loading');

  const { assignCompanyMentor, isLoading: isAssigningMentor } =
    useAssignCompanyMentor({
      companyMentorEmail: internshipDetails.company_mentor_email,
      internshipId: internshipId,
    });

  const { addHomeCoordinates } = useAddHomeCoordinates({
    internshipId,
    studentId: internshipDetails.student_uid,
  });

  const coordinatesForm = useForm<z.infer<typeof setCoordinatesFormSchema>>({
    resolver: zodResolver(setCoordinatesFormSchema),
    defaultValues: {
      coordinates: '',
      radius: 0,
    },
  });

  const emailForm = useForm<z.infer<typeof sendEmailFormSchema>>({
    resolver: zodResolver(sendEmailFormSchema),
    defaultValues: {
      subject: '',
      body: '',
    },
  });

  useEffect(() => {
    const supabase = supabaseClient();
    const checkCompanyMentor = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, email, roles (name)')
          .eq('email', internshipDetails.company_mentor_email)
          .eq('roles.name', 'company-mentor')
          .single();

        if (error) {
          setCompanyMentorStatus('not-found');
        } else if (data) {
          setCompanyMentorStatus('company-mentor');
        }
      } catch (err) {
        setCompanyMentorStatus('error');
      }
    };

    if (!internshipDetails.company_mentor_email) {
      setCompanyMentorStatus('no-email');
      return;
    }

    checkCompanyMentor();
  }, [internshipDetails]);

  const handleSendEmail = async (
    values: z.infer<typeof sendEmailFormSchema>
  ) => {
    setIsSendingEmail(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyMentorEmail: internshipDetails.company_mentor_email,
          emailSubject: values.subject,
          emailBody: values.body,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An error occurred while sending the invite.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  function handleSubmitHomeCoordinates(
    values: z.infer<typeof setCoordinatesFormSchema>
  ) {
    const { coordinates, radius } = values;
    const [latitude, longitude] = coordinates.split(',').map((c) => +c.trim());
    setOpenCoordinatesDialog(false);
    addHomeCoordinates(latitude, longitude, radius);
  }

  return (
    internshipDetails && (
      <Card className="p-5">
        <div className="grid gap-6 overflow-x-auto">
          <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
            <div className="col-span-2 my-auto text-muted-foreground">
              Student Name
            </div>
            <div className="col-span-3 flex items-center">
              {internshipDetails.student_name}
            </div>
          </div>
          <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
            <div className="col-span-2 my-auto text-muted-foreground">Role</div>
            <div className="col-span-3 flex items-center">
              {internshipDetails.role}
            </div>
          </div>
          <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
            <div className="col-span-2 my-auto text-muted-foreground">
              Field
            </div>
            <div className="col-span-3 flex items-center">
              {internshipDetails.field}
            </div>
          </div>
          <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
            <div className="col-span-2 my-auto text-muted-foreground">Mode</div>
            <div className="col-span-3 flex items-center">
              {internshipDetails.mode === 'hybrid' ? 'Hybrid' : 'Offline'}
            </div>
          </div>
          <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
            <div className="col-span-2 my-auto text-muted-foreground">
              Start Date
            </div>
            <div className="col-span-3 flex items-center">
              {formatDateForDisplay(internshipDetails.start_date)}
            </div>
          </div>
          <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
            <div className="col-span-2 my-auto text-muted-foreground">
              End Date
            </div>
            <div className="col-span-3 flex items-center">
              {formatDateForDisplay(internshipDetails.end_date)}
            </div>
          </div>
          <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
            <div className="col-span-2 my-auto text-muted-foreground">
              Internship Letter
            </div>
            <div className="col-span-3 flex items-center">
              <InternshipLetterCell
                internshipLetterUrl={internshipDetails.internship_letter_url}
              />
            </div>
          </div>
          <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
            <div className="col-span-2 my-auto text-muted-foreground">
              Company Name
            </div>
            <div className="col-span-3 flex items-center">
              {internshipDetails.company_name}
            </div>
          </div>
          <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
            <div className="col-span-2 my-auto text-muted-foreground">
              Company Mentor Email
            </div>
            <div className="col-span-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
              {companyMentorStatus === 'loading' && '...'}
              {companyMentorStatus === 'no-email' && 'N/A'}
              {companyMentorStatus === 'not-found' && (
                <>
                  <span className="flex items-center flex-wrap">
                    <span>{internshipDetails.company_mentor_email}&nbsp;</span>
                    <span className="text-sm text-red-400">
                      (Not registered)
                    </span>
                  </span>
                  {internshipDetails.approved && (
                    <Dialog
                      open={openEmailDialog}
                      onOpenChange={setOpenEmailDialog}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm" disabled={isSendingEmail}>
                          {isSendingEmail ? 'Sending...' : 'Send Invite'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Send Invite</DialogTitle>
                          <div className="flex gap-2 pt-2 text-muted-foreground">
                            Include this link in the email to invite the company
                            mentor to register on the platform.
                            <br />
                            <Button
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `${process.env.NEXT_PUBLIC_URL}/register/company-mentor?email=${internshipDetails.company_mentor_email}`
                                );
                                toast.success('Link copied to clipboard');
                              }}
                            >
                              Copy Link
                            </Button>
                          </div>
                        </DialogHeader>
                        <Form {...emailForm}>
                          <form
                            onSubmit={emailForm.handleSubmit(handleSendEmail)}
                          >
                            <div className="pb-5 space-y-3">
                              <InputBox
                                id="subject"
                                type="text"
                                label="Subject"
                                placeholder="Enter email subject"
                                form={emailForm}
                              />
                              <FormField
                                control={emailForm.control}
                                name="body"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="flex gap-2 items-center h-5">
                                      <FormLabel>Body</FormLabel>
                                      <FormMessage />
                                    </div>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Enter email body"
                                        rows={15}
                                        className="resize-none"
                                        {...field}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                            <DialogFooter>
                              <Button
                                type="submit"
                                onClick={() => {
                                  setOpenEmailDialog(false);
                                }}
                              >
                                Submit
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  )}
                </>
              )}
              {companyMentorStatus === 'company-mentor' && (
                <>
                  <span>{internshipDetails.company_mentor_email}</span>
                  {internshipDetails.approved &&
                    (internshipDetails.company_mentor_uid ? (
                      <Dialog
                        open={openEmailDialog}
                        onOpenChange={setOpenEmailDialog}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm" disabled={isSendingEmail}>
                            {isSendingEmail ? 'Sending...' : 'Send Email'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Send Email</DialogTitle>
                          </DialogHeader>
                          <Form {...emailForm}>
                            <form
                              onSubmit={emailForm.handleSubmit(handleSendEmail)}
                            >
                              <div className="pb-5 space-y-3">
                                <InputBox
                                  id="subject"
                                  type="text"
                                  label="Subject"
                                  placeholder="Enter email subject"
                                  form={emailForm}
                                />
                                <FormField
                                  control={emailForm.control}
                                  name="body"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div className="flex gap-2 items-center h-5">
                                        <FormLabel>Body</FormLabel>
                                        <FormMessage />
                                      </div>
                                      <FormControl>
                                        <Textarea
                                          placeholder="Enter email body"
                                          rows={15}
                                          className="resize-none"
                                          {...field}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <DialogFooter>
                                <Button
                                  type="submit"
                                  onClick={() => {
                                    setOpenEmailDialog(false);
                                  }}
                                >
                                  Submit
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Button
                        size="sm"
                        onClick={assignCompanyMentor}
                        disabled={isAssigningMentor}
                      >
                        {isAssigningMentor ? 'Assigning...' : 'Assign Mentor'}
                      </Button>
                    ))}
                </>
              )}
            </div>
          </div>
          {internshipDetails.company_mentor_uid && (
            <>
              <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
                <div className="col-span-2 my-auto text-muted-foreground">
                  Company Mentor Name
                </div>
                <div className="col-span-3 flex items-center">
                  {internshipDetails.company_mentor_name || 'N/A'}
                </div>
              </div>
              <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
                <div className="col-span-2 my-auto text-muted-foreground">
                  Company Mentor Designation
                </div>
                <div className="col-span-3 flex items-center">
                  {internshipDetails.company_mentor_designation || 'N/A'}
                </div>
              </div>
              <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
                <div className="col-span-2 my-auto text-muted-foreground">
                  Company Address
                </div>
                <div className="col-span-3 flex items-center">
                  {internshipDetails.company_address}
                </div>
              </div>
              <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
                <div className="col-span-2 my-auto text-muted-foreground">
                  Company Coordinates
                </div>
                <div className="col-span-3 flex items-center">
                  {internshipDetails.company_latitude
                    ? `${internshipDetails.company_latitude}, ${internshipDetails.company_longitude}`
                    : 'N/A'}
                </div>
              </div>
            </>
          )}
          {internshipDetails.mode === 'hybrid' && (
            <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
              <div className="col-span-2 my-auto text-muted-foreground">
                Home Coordinates
              </div>
              <div className="col-span-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
                <span>
                  {internshipDetails.student_home_latitude
                    ? `${internshipDetails.student_home_latitude}, ${internshipDetails.student_home_longitude}`
                    : 'N/A'}
                </span>
                {!internshipDetails.student_home_latitude && (
                  <>
                    <Dialog
                      open={openCoordinatesDialog}
                      onOpenChange={setOpenCoordinatesDialog}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm">Set Coordinates</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Set Home Coordinates</DialogTitle>
                        </DialogHeader>
                        <Form {...coordinatesForm}>
                          <form
                            onSubmit={coordinatesForm.handleSubmit(
                              handleSubmitHomeCoordinates
                            )}
                          >
                            <div className="pb-5 space-y-3">
                              <InputBox
                                id="coordinates"
                                type="text"
                                label="Coordinates"
                                placeholder="Enter latitude, longitude"
                                description={
                                  <>
                                    To find coordinates, open{' '}
                                    <Link
                                      href="https://www.google.com/maps"
                                      className="text-primary underline"
                                      target="_blank"
                                    >
                                      Google Maps
                                    </Link>
                                    , search for the location, right-click on
                                    the spot, and copy the latitude and
                                    longitude (Example: 18.92199, 72.83457).
                                  </>
                                }
                                form={coordinatesForm}
                              />
                              <InputBox
                                id="radius"
                                type="number"
                                label="Home Radius"
                                placeholder="Enter home radius in meters"
                                description="Enter the radius (in meters) around the selected location to define the area for attendance."
                                form={coordinatesForm}
                              />
                            </div>
                            <DialogFooter>
                              <Button type="submit">Submit</Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    )
  );
};

export default InternshipDetailsCard;
