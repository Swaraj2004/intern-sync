'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/password-input';
import setPasswordFormSchema from '@/formSchemas/setPasswordSchema';
import { supabaseClient } from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const SetPasswordForm = () => {
  const supabase = supabaseClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof setPasswordFormSchema>>({
    resolver: zodResolver(setPasswordFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof setPasswordFormSchema>) => {
    setLoading(true);

    const { data, error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success('Password set successfully. Redirecting to dashboard...');
    router.push('/dashboard');
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 w-full mt-5"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <PasswordInput placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <PasswordInput placeholder="Confirm Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className={`mt-2 ${loading && 'opacity-60 cursor-not-allowed'}`}
        >
          Set Password
        </Button>
      </form>
    </Form>
  );
};

export default SetPasswordForm;
