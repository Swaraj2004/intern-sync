'use client';

import InputBox from '@/components/ui/InputBox';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/password-input';
import loginFormSchema from '@/formSchemas/loginUser';
import { supabaseClient } from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const StudentLoginForm = () => {
  const supabase = supabaseClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    const { email, password } = values;
    setLoading(true);

    const { data, error } = await supabase
      .from('users')
      .select('id,email,user_roles (role_id, roles (name))')
      .eq('email', email)
      .single();

    if (error || !data) {
      toast.error('Email does not exist.');
      setLoading(false);
      return;
    }

    const hasCompanyMentorRole = data.user_roles?.some(
      (role) => role.roles?.name === 'student'
    );

    if (!hasCompanyMentorRole) {
      toast.error('User is not a student.');
      setLoading(false);
      return;
    }

    const { error: signinError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signinError) {
      toast.error(signinError.message);
      setLoading(false);
      return;
    }

    toast.success('Login successfull. Redirecting to dashboard...');

    router.push('/dashboard/student');
  }

  return (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(onSubmit)} className="grid gap-5">
        <InputBox label="Email" id="email" type="email" form={loginForm} />
        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className={`mt-2 ${loading && 'opacity-60 cursor-not-allowed'}`}
        >
          Login
        </Button>
      </form>
    </Form>
  );
};

export default StudentLoginForm;
