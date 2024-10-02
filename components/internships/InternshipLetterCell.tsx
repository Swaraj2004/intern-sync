import { Button } from '@/components/ui/button';
import { supabaseClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { toast } from 'sonner';

const supabase = supabaseClient();

const InternshipLetterCell = ({
  internshipLetterUrl,
}: {
  internshipLetterUrl: string;
}) => {
  const [loading, setLoading] = useState(false);

  const handleViewLetter = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from('internship-letters')
      .createSignedUrl(internshipLetterUrl, 60 * 60);

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
    <Button
      onClick={handleViewLetter}
      disabled={loading}
      variant="link"
      className="p-0 h-fit"
    >
      {loading ? 'Generating Link...' : 'View Letter'}
    </Button>
  );
};

export default InternshipLetterCell;
