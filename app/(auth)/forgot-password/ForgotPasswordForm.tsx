'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputBox from '@/components/ui/InputBox';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import * as z from 'zod';
import { supabaseClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email address is required.' })
    .email({ message: 'Invalid email address.' }),
});

const ForgotPasswordForm = () => {
  const supabase = supabaseClient();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', values.email)
      .single();

    if (userError) {
      toast.error('Email does not exist.');
      setLoading(false);
      return;
    }

    if (!user.is_verified) {
      toast.error('Email is not verified.');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(
      values.email,
      {
        redirectTo: `${window.location.origin}/update-password`,
      }
    );

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success('Link for password change sent successfully.');
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-2 w-full mt-5"
      >
        <InputBox
          label="Enter your email"
          id="email"
          type="email"
          form={form}
          noLabel
        />
        <Button
          className={`mt-2 ${loading && 'opacity-60 cursor-not-allowed'}`}
        >
          Send Forgot Password Link
        </Button>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
