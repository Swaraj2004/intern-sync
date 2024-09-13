'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import Logo from '@/components/ui/Logo';
import { PasswordInput } from '@/components/ui/password-input';
import setPasswordFormSchema from '@/formSchemas/setPasswordSchema';
import { supabaseClient } from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const ForgotPasswordForm = () => {
  const supabase = supabaseClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          setShowForm(true);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const form = useForm<z.infer<typeof setPasswordFormSchema>>({
    resolver: zodResolver(setPasswordFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof setPasswordFormSchema>) => {
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success('Password changed successfully. Redirecting to login...');

    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      toast.error(signOutError.message);
      return;
    }
    router.push('/login');
    setLoading(false);
  };

  return (
    <>
      {mounted &&
        (showForm ? (
          <Card className="p-8 mx-4 md:p-10 w-full max-w-96 sm:max-w-md">
            <div className="flex flex-col items-center">
              <Link
                href="/"
                draggable="false"
                className="flex items-center mb-4 justify-center w-fit"
              >
                <Logo className="h-14 w-14" />
              </Link>
              <div className="text-2xl font-medium">Update Password</div>
            </div>
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
                        <PasswordInput
                          placeholder="Confirm Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className={`mt-2 ${
                    loading && 'opacity-60 cursor-not-allowed'
                  }`}
                >
                  Update Password
                </Button>
              </form>
            </Form>
          </Card>
        ) : (
          <div>Page not accessible.</div>
        ))}
    </>
  );
};

export default ForgotPasswordForm;
