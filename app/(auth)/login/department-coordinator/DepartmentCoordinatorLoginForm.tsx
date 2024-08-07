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

const DepartmentCoordinatorLoginForm = () => {
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

    const { data: user, error: userError } = await supabase
      .from('users')
      .select()
      .eq('email', email)
      .single();

    if (userError) {
      toast.error('Email does not exist.');
      setLoading(false);
      return;
    }

    const { data: roleData, error: rolesError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'department-coordinator')
      .single();

    if (rolesError && !roleData) {
      toast.error(rolesError.message);
      setLoading(false);
      return;
    }

    const { data: userRoleData, error: userRoleError } = await supabase
      .from('user_roles')
      .select('uid')
      .eq('uid', user.id)
      .eq('role_id', roleData.id)
      .single();

    if (userRoleError && !userRoleData) {
      toast.error('User is not an department coordinator.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success('Login successfull. Redirecting to dashboard...');

    router.push('/dashboard/department-coordinator');
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

export default DepartmentCoordinatorLoginForm;
