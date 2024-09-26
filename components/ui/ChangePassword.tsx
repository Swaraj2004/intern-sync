'use client';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import setPasswordFormSchema from '@/formSchemas/setPasswordSchema';
import { supabaseClient } from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { PasswordInput } from './password-input';

const supabase = supabaseClient();

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const form = useForm<z.infer<typeof setPasswordFormSchema>>({
    resolver: zodResolver(setPasswordFormSchema),
  });

  const handleUpdatePassword = async (
    values: z.infer<typeof setPasswordFormSchema>
  ) => {
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    setShowChangePassword(!showChangePassword);
    setLoading(false);
    toast.success('Password updated successfully.');
  };

  return (
    <Card className="p-5 mt-5">
      <div className="flex justify-between flex-wrap gap-5">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-xl">Change your password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </div>
        {!showChangePassword && (
          <Button
            size="sm"
            className="bg-primary text-white"
            onClick={() => {
              setShowChangePassword(!showChangePassword);
            }}
          >
            Change Password
          </Button>
        )}
      </div>
      {showChangePassword && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdatePassword)}
            className="grid gap-5 mt-5"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                  <FormLabel className="sm:col-span-2 font-normal text-base my-auto text-muted-foreground">
                    Password
                  </FormLabel>
                  <FormControl className="sm:col-span-3">
                    <div className="w-full sm:max-w-96">
                      <PasswordInput
                        placeholder="Enter password"
                        className="sm:max-w-96"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="sm:col-span-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                  <FormLabel className="sm:col-span-2 font-normal text-base my-auto text-muted-foreground">
                    Confirm Password
                  </FormLabel>
                  <FormControl className="sm:col-span-3">
                    <div className="w-full sm:max-w-96">
                      <PasswordInput
                        placeholder="Enter password again"
                        className="sm:max-w-96"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="sm:col-span-2" />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <Button
                type="submit"
                className={`${loading && 'opacity-60 cursor-not-allowed'}`}
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setShowChangePassword(!showChangePassword);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      )}
    </Card>
  );
};

export default ChangePassword;
