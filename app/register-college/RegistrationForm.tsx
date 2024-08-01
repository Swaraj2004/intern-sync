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
import { supabaseClient } from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import registrationFormSchema from '@/formSchemas/registerCollege';
import { useRouter } from 'next/navigation';

const RegistrationForm = () => {
  const supabase = supabaseClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const registerForm = useForm<z.infer<typeof registrationFormSchema>>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      instituteId: '',
      instituteName: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof registrationFormSchema>) {
    const { instituteId, instituteName, email, password } = values;
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    const { data: roleData, error: rolesError } = await supabase
      .from('roles')
      .select('id')
      .eq('role_name', 'super-admin');

    if (rolesError) {
      toast.error(rolesError.message);
      return;
    }

    if (data && roleData) {
      const { error } = await supabase.from('institutes').insert([
        {
          email,
          id: parseInt(instituteId),
          name: instituteName,
          role_id: roleData[0].id,
        },
      ]);

      if (error) {
        toast.error(error.details);
        return;
      }

      toast.success('Registration successfull! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  }

  return (
    <div>
      <Form {...registerForm}>
        <form
          onSubmit={registerForm.handleSubmit(onSubmit)}
          className="grid gap-5"
        >
          <InputBox
            label="Institute ID"
            id="instituteId"
            type="number"
            form={registerForm}
          />
          <InputBox
            label="Institute Name"
            id="instituteName"
            type="text"
            form={registerForm}
          />
          <InputBox label="Email" id="email" type="email" form={registerForm} />
          <FormField
            control={registerForm.control}
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
            Register
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;
