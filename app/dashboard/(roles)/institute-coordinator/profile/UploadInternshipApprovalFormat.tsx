'use client';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { supabaseClient } from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import { useUpdateInstituteProfile } from '@/services/mutations/profile';
import { DownloadIcon } from 'lucide-react';

const supabase = supabaseClient();

const uploadFormatFormSchema = z.object({
  letterFormat: z
    .any()
    .refine((files) => files?.length !== 0, 'Please upload internship letter.')
    .refine((files) => {
      console.log('File size:', files?.[0]?.size);
      return files?.[0]?.size <= 512 * 1024;
    }, 'File size should be 512KB or less')
    .refine((files) => {
      if (!files) return false;
      const file = files[0];
      return (
        file.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
    }, 'Only .docx file is accepted.'),
});

const UploadInternshipApprovalFormat = ({
  internshipApprovalFormatUrl,
}: {
  internshipApprovalFormatUrl: string | null;
}) => {
  const { instituteId } = useUser();
  const [loading, setLoading] = useState(false);
  const [showUploadFormat, setShowUploadFormat] = useState(false);

  const form = useForm<z.infer<typeof uploadFormatFormSchema>>({
    resolver: zodResolver(uploadFormatFormSchema),
    defaultValues: {
      letterFormat: [],
    },
  });

  const { updateInternshipLetterFormatUrl } = useUpdateInstituteProfile({
    userId: instituteId!,
  });

  const handleUploadFormat = async (
    values: z.infer<typeof uploadFormatFormSchema>
  ) => {
    setLoading(true);

    const { data: fileData, error: fileError } = await supabase.storage
      .from('internship-approval-formats')
      .upload(
        `${instituteId}/${values.letterFormat[0].name}`,
        values.letterFormat[0],
        { upsert: true }
      );

    if (fileError) {
      setLoading(false);
      toast.error(fileError.message);
      return;
    }

    await updateInternshipLetterFormatUrl(fileData.path);

    setShowUploadFormat(false);
    setLoading(false);
  };

  const handleViewExampleTemplate = async () => {
    const { data } = supabase.storage
      .from('internship-approval-format-template')
      .getPublicUrl('example-template.docx');

    if (data?.publicUrl) {
      window.open(data.publicUrl, '_blank');
    } else {
      toast.error('Failed to retrieve public URL.');
    }
  };

  const handleViewUploadedFormat = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from('internship-approval-formats')
      .createSignedUrl(internshipApprovalFormatUrl!, 60 * 60);

    setLoading(false);

    if (error) {
      toast.error('Failed to generate signed URL.');
      return;
    }

    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank');
    }
  };

  return (
    <Card className="p-5 mt-5">
      <div className="flex justify-between flex-wrap md:flex-nowrap gap-5">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-xl">
            Upload internship approval letter format
          </CardTitle>
          <CardDescription>
            <span>
              Upload the format for the internship approval letter according to
              the provided
            </span>{' '}
            <Button
              onClick={handleViewExampleTemplate}
              disabled={loading}
              variant="link"
              className="p-0 h-fit"
            >
              example template.
            </Button>
            <br />
            <span>
              The format should be in .docx format and should not exceed 512KB.
            </span>
          </CardDescription>
        </div>
        <div className="flex gap-2 md:flex-row-reverse">
          {!showUploadFormat && (
            <Button
              size="sm"
              onClick={() => {
                setShowUploadFormat(!showUploadFormat);
              }}
            >
              {internshipApprovalFormatUrl ? 'Update Format' : 'Upload Format'}
            </Button>
          )}
          {internshipApprovalFormatUrl && !showUploadFormat && (
            <Button
              onClick={handleViewUploadedFormat}
              variant="outline"
              className="h-9 w-9 p-1"
            >
              <DownloadIcon className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
      {showUploadFormat && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUploadFormat)}
            className="grid gap-5 mt-5"
          >
            <FormField
              control={form.control}
              name="letterFormat"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                  <FormLabel className="sm:col-span-2 font-normal text-base my-auto text-muted-foreground">
                    Internship Approval Letter Format
                  </FormLabel>
                  <FormControl className="sm:col-span-3">
                    <div className="w-full sm:max-w-96">
                      <Input
                        type="file"
                        multiple={false}
                        {...rest}
                        onChange={(event) => {
                          onChange(event.target.files);
                        }}
                        className="hover:cursor-pointer"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="sm:col-span-2" />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <Button
                type="submit"
                className={`${loading && 'opacity-60 cursor-not-allowed'}`}
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setShowUploadFormat(!showUploadFormat);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      )}
    </Card>
  );
};

export default UploadInternshipApprovalFormat;
