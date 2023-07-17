'use client';
import Button from '@app/components/Button';
import Text from '@app/components/Text';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Field from '@app/(login)/components/field';
import useBoolean from '@app/hooks/useBoolean';
import { EmbeddedResponseStatus } from '@mangayomu/request-handler';

type UserAPIRequestFormBody = z.infer<typeof userAPIRequestBodySchema>;
interface UserAPISchemaError {
  response: EmbeddedResponseStatus;
  errors: Record<string, { code: string; message: string }[]>;
}

export const userAPIRequestBodySchema = z
  .object({
    username: z
      .string()
      .min(1, 'Username is required')
      .max(100, 'Username cannot be greater than 100 characters')
      .regex(/^(?!.*[^A-Za-z0-9_]).+$/g, 'Special characters are not allowed'),
    email: z.string().email('Invalid email').min(1, 'Email is required'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have more than 8 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export default function Form() {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
    clearErrors,
  } = useForm<UserAPIRequestFormBody>({
    resolver: zodResolver(userAPIRequestBodySchema),
  });
  const [loading, toggle] = useBoolean();
  const [apiError, setApiError] = React.useState<string>('');
  const onSubmit: SubmitHandler<UserAPIRequestFormBody> = async (formData) => {
    toggle(true);
    clearErrors();
    setApiError('');
    try {
      const response = await fetch('/api/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data: UserAPISchemaError = await response.json();
      console.log(JSON.stringify(data, null, 2));
      if ('errors' in data)
        for (const key in data.errors) {
          setError(key as keyof UserAPIRequestFormBody, {
            message:
              data.errors[key as keyof UserAPIRequestFormBody][0].message,
          });
        }
    } catch (e) {
      setApiError(`${e}` as string);
    } finally {
      toggle(false);
    }
  };

  return (
    <>
      <div>
        <Text variant="header-emphasized">Create an account</Text>
        <Text color="text-secondary">
          Join MangaYomu for free and gain features exclusive to users.
        </Text>
      </div>
      <form className="flex flex-col gap-2">
        <Field
          error={errors.username}
          register={register('username')}
          name="Username"
        />
        <Field
          error={errors.email}
          register={register('email')}
          name="Email address"
        />
        <div className="flex flex-row gap-2">
          <Field
            error={errors.password}
            register={register('password')}
            name="Password"
            hint="Must be at least 8 characters"
            type="password"
          />
          <Field
            error={errors.confirmPassword}
            register={register('confirmPassword')}
            name="Confirm Password"
            type="password"
          />
        </div>
        {apiError && <Text color="error">Error: {apiError}</Text>}
        <Button
          disabled={loading}
          type="submit"
          variant="contained"
          className="mt-4"
          onClick={handleSubmit(onSubmit)}
        >
          Create Account
        </Button>
        <Text
          component="a"
          href="/login"
          variant="sm-label"
          color="primary"
          className="text-end"
        >
          Already have an account?
        </Text>
      </form>
    </>
  );
}
