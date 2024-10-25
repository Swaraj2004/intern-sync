import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader } from '@/components/ui/Loader';
import { convertSnakeCaseToTitleCase } from '@/lib/utils';
import { supabaseClient } from '@/utils/supabase/client';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import PizZip from 'pizzip';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

const supabase = supabaseClient();

const GenerateInternshipApprovalLetter = ({
  approvalFormatUrl,
}: {
  approvalFormatUrl: string;
}) => {
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState<string[] | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [docZip, setDocZip] = useState<PizZip | null>(null);

  const fetchTemplateAndParse = useCallback(async () => {
    try {
      setLoading(true);

      if (docZip) return;

      const { data, error } = await supabase.storage
        .from('internship-approval-formats')
        .download(approvalFormatUrl);

      if (error) throw error;

      const arrayBuffer = await data.arrayBuffer();
      const zip = new PizZip(new Uint8Array(arrayBuffer));
      const doc = new Docxtemplater(zip);

      const placeholderRegex = /{(.*?)}/g;
      const text = doc.getFullText();
      const uniqueFields = Array.from(new Set(text.match(placeholderRegex)));

      const fieldNames = uniqueFields.map((field) =>
        field.replace(/{|}/g, '').trim()
      );
      setFields(fieldNames);

      const initialFormData = fieldNames.reduce(
        (acc: { [key: string]: string }, field) => {
          acc[field] = '';
          return acc;
        },
        {}
      );
      setFormData(initialFormData);
      setDocZip(zip);
    } catch (error) {
      toast.error('Error loading template.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [approvalFormatUrl, docZip]);

  useEffect(() => {
    fetchTemplateAndParse();
  }, [fetchTemplateAndParse]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenerateDocx = async () => {
    try {
      setLoading(true);
      if (!docZip) throw new Error('Document template not loaded.');

      const docTemplate = new Docxtemplater(docZip);
      docTemplate.setData(formData);
      docTemplate.render();

      const output = docTemplate.getZip().generate({
        type: 'blob',
        mimeType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      saveAs(output, 'internship-approval-letter.docx');
      toast.success('Letter generated successfully.');
    } catch (error) {
      toast.error('Error generating document.');
      console.error(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Generate Approval Letter</Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className={`w-[calc(100vw-24px)] sm:max-w-[450px] max-h-[calc(100vh-24px)] overflow-y-auto ${
          fields && fields.length >= 6 && 'md:max-w-[850px]'
        }`}
      >
        <DialogHeader>
          <DialogTitle>Generate Approval Letter</DialogTitle>
        </DialogHeader>
        {fields ? (
          fields.length > 0 ? (
            <form>
              <div
                className={`grid w-full gap-5 mb-5 mt-2 ${
                  fields.length >= 6 && 'md:grid-cols-2'
                }`}
              >
                {fields.map((field) => (
                  <div key={field} className="grid w-full gap-3">
                    <Label htmlFor={field}>
                      {convertSnakeCaseToTitleCase(field)}
                    </Label>
                    <Input
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      placeholder={`Enter ${convertSnakeCaseToTitleCase(
                        field
                      )}`}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={handleGenerateDocx}
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Download Letter'}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <div className="h-40 flex justify-center items-center">
              The template has no form fields. Please contact the college
              mentor.
            </div>
          )
        ) : (
          <div className="h-40 flex justify-center items-center">
            <Loader />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GenerateInternshipApprovalLetter;
