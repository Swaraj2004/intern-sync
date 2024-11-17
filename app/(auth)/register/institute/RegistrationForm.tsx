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
import registrationFormSchema from '@/formSchemas/registerCollege';
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
      aicteId: '',
      instituteName: '',
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof registrationFormSchema>) {
    const { aicteId, instituteName, fullName, email, password } = values;
    setLoading(true);

    const { data: roleData, error: rolesError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'institute-coordinator')
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
          name: fullName.trim(),
          email: email.trim(),
        },
      ])
      .select('id');

    if (usersError) {
      toast.error('Email already exists. Please try to login.');
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
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

    const { error: instituteError } = await supabase.from('institutes').insert({
      aicte_id: aicteId.trim(),
      name: instituteName.trim(),
      uid: usersData[0].id,
    });

    if (instituteError) {
      toast.error(instituteError.message);
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
      router.push('/login');
    }, 500);
  }

  return (
    <div>
      <Form {...registerForm}>
        <form
          onSubmit={registerForm.handleSubmit(onSubmit)}
          className="grid gap-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputBox
              label="Institute Name"
              placeholder="Enter Institute Name"
              id="instituteName"
              type="text"
              form={registerForm}
            />
            <InputBox
              label="AICTE ID"
              placeholder="Enter AICTE ID"
              id="aicteId"
              type="text"
              form={registerForm}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
          </div>
          <Button
            className={`mt-2 ${
              loading && 'opacity-60 cursor-not-allowed'
            } sm:max-w-24 mx-auto`}
          >
            Register
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;
