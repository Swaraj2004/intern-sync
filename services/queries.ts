import { supabaseClient } from '@/utils/supabase/client';
import { useQuery } from '@supabase-cache-helpers/postgrest-swr';

const supabase = supabaseClient();

export const useDepartments = ({ instituteId }: { instituteId: number }) => {
  const shouldFetch = Boolean(instituteId);

  const { data, ...rest } = useQuery(
    shouldFetch
      ? supabase
          .from('departments')
          .select(
            'uid, name, users (id, auth_id, name, email, is_registered, is_verified)'
          )
          .eq('institute_id', instituteId)
          .order('name', { ascending: true })
      : null
  );

  return {
    data,
    ...rest,
  };
};
