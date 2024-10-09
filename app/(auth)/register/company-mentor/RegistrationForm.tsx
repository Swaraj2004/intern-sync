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
import registrationFormSchema from '@/formSchemas/registerCompanyMentor';
import { supabaseClient } from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const RegistrationForm = () => {
  const supabase = supabaseClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const registerForm = useForm<z.infer<typeof registrationFormSchema>>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof registrationFormSchema>) {
    const { fullName, email, password } = values;
    setLoading(true);

    const { data: roleData, error: rolesError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'company-mentor')
      .single();

    if (rolesError && !roleData) {
      toast.error(rolesError.message);
      setLoading(false);
      return;
    }

    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .insert([
        {
          name: fullName,
          email,
        },
      ])
      .select('id');

    if (usersError) {
      toast.error('Email already exists. Please try to login.');
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/verify-email`,
        data: {
          uid: usersData[0].id,
        },
      },
    });

    if (signUpError) {
      toast.error(signUpError.message);
      setLoading(false);
      return;
    }

    const { error: updateUserError } = await supabase
      .from('users')
      .update({
        auth_id: data.user && data.user.id,
        is_registered: true,
      })
      .eq('id', usersData[0].id);

    if (updateUserError) {
      toast.error(updateUserError.message);
      setLoading(false);
      return;
    }

    const { error: companyMentorError } = await supabase
      .from('company_mentors')
      .insert({
        uid: usersData[0].id,
      });

    if (companyMentorError) {
      toast.error(companyMentorError.message);
      setLoading(false);
      return;
    }

    const { error: userRolesError } = await supabase.from('user_roles').insert({
      uid: usersData[0].id,
      role_id: roleData.id,
    });

    if (userRolesError) {
      toast.error(userRolesError.message);
      setLoading(false);
      return;
    }

    toast.success('Registration successfull! Verification email sent.');
    setTimeout(() => {
      router.push('/login/company-mentor');
    }, 500);
  }

  return (
    <Form {...registerForm}>
      <form
        onSubmit={registerForm.handleSubmit(onSubmit)}
        className="grid gap-5"
      >
        <InputBox
          label="Full Name"
          placeholder="Enter Full Name"
          id="fullName"
          type="text"
          form={registerForm}
        />
        <InputBox
          label="Email"
          placeholder="Enter Email"
          id="email"
          type="email"
          form={registerForm}
        />
        <FormField
          control={registerForm.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Enter Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={registerForm.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Confirm Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className={`mt-2 ${
            loading && 'opacity-60 cursor-not-allowed'
          } sm:max-w-24 mx-auto`}
        >
          Register
        </Button>
      </form>
    </Form>
  );
};

export default RegistrationForm;
