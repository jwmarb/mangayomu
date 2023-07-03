'use client';
import { useForm, SubmitHandler } from 'react-hook-form';
import React from 'react';
import Button from '@app/components/Button';
import Text from '@app/components/Text';
import Checkbox from '@app/components/Checkbox';
import useBoolean from '@app/hooks/useBoolean';
import * as Realm from 'realm-web';
import zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Field from '@app/(login)/components/field';
import { EmbeddedResponseStatus } from '@mangayomu/request-handler';
import { useRouter } from 'next/navigation';
import { useRealm, useUser } from '@app/context/realm';

interface FormProps {
  clientId: string;
}

const formSchema = zod.object({
  username: zod.string().min(1, 'A username or email is required'),
  password: zod.string().min(1, 'A password is required'),
});

type FormInput = zod.infer<typeof formSchema>;

type AuthAPIResponse =
  | { id_token: string }
  | { response: EmbeddedResponseStatus; error: string };

export default function Form({ clientId }: FormProps) {
  // const [success, error, SignInWithGoogle] = useLoadGSIScript(clientId);
  const realm = useRealm();
  const user = useUser();
  const [loading, setLoading] = useBoolean();
  const [authError, setAuthError] = useBoolean();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormInput>({ resolver: zodResolver(formSchema) });

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    setAuthError(false);
    setLoading(true);
    clearErrors();
    try {
      // alert('Sending...');
      const response = await fetch('/api/v1/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result: AuthAPIResponse = await response.json();

      if ('id_token' in result) {
        const jwtCredentials = Realm.Credentials.jwt(result.id_token);
        await realm.logIn(jwtCredentials);
        router.push('/');
      } else {
        setError('username', {});
        setError('password', {});
        setAuthError(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // const rememberMe = register('rememberMe');

  const handler = handleSubmit(onSubmit);

  return (
    <>
      <form onSubmit={handler} className="flex flex-col gap-2">
        <Field
          name="Username or email"
          register={register('username')}
          error={errors.username}
        />
        <Field
          type="password"
          name="Password"
          register={register('password')}
          error={errors.password}
        />
        {authError && (
          <div className="px-3 py-2">
            <Text color="error" className="text-center">
              Invalid username or password
            </Text>
          </div>
        )}
        <div className="items-center justify-between space-x-2 flex">
          <div className="flex items-center justify-between gap-2">
            <Checkbox id="remember-me" />
            <Text
              component="label"
              htmlFor="remember-me"
              className="select-none"
            >
              Remember me
            </Text>
          </div>
          <Text component="a" color="primary" href="/reset-password">
            Forgot password?
          </Text>
        </div>
        <div className="mt-4 grid gap-2">
          <Button
            type="submit"
            disabled={loading}
            color="primary"
            variant="contained"
            className="w-full"
          >
            Login
          </Button>
          <div className="flex gap-1 justify-end">
            <Text variant="sm-label" color="hint">
              Don&apos;t have an account?{' '}
            </Text>
            <Text
              component="a"
              href="/register"
              variant="sm-label"
              color="primary"
            >
              Register here
            </Text>
          </div>
        </div>
      </form>
      <div className="flex items-center gap-1 py-4">
        <div className="h-0.5 flex-grow bg-border" />
        <div className="flex-shrink">
          <Text variant="sm-label" color="hint" className="text-center">
            or use another provider
          </Text>
        </div>
        <div className="h-0.5 flex-grow bg-border" />
      </div>
      <div className="grid grid-row-2 gap-1 justify-center">{/** Todo */}</div>
    </>
  );
}
