import Box from '@components/Box';
import Button from '@components/Button';
import Field from '@components/Field';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import useForm from '@hooks/useForm';
import { RootStackProps } from '@navigators/Root/Root.interfaces';
import React from 'react';
import { KeyboardAvoidingView, Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { z } from 'zod';
import { BACKEND_URL } from 'env';
import axios, { AxiosError } from 'axios';
import displayMessage from '@helpers/displayMessage';

const styles = StyleSheet.create({
  content: {
    minHeight: '100%',
    justifyContent: 'center',
  },
});

type UserAPIRequestFormBody = z.infer<typeof userAPIRequestBodySchema>;
interface UserAPISchemaError {
  response: {
    status_code: number;
    message: string;
  };
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

const Register: React.FC<RootStackProps<'Register'>> = ({ navigation }) => {
  const { onScroll, contentContainerStyle, scrollViewStyle } =
    useCollapsibleHeader({
      headerTitle: '',
    });
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { register, handleSubmit, setError } = useForm<UserAPIRequestFormBody>(
    userAPIRequestBodySchema,
  );

  const onBack = () => {
    navigation.navigate('Login');
  };

  const onSubmit = handleSubmit(async (val) => {
    try {
      await axios.post(BACKEND_URL + '/api/v1/register', val);
      displayMessage('Account created. Please log in');
      navigation.navigate('Login');
    } catch (e) {
      const error = e as AxiosError<UserAPISchemaError>;
      if (error.response)
        setError(
          Object.entries<
            UserAPISchemaError['errors'][keyof UserAPISchemaError['errors']]
          >(error.response.data.errors).reduce((prev, [key, val]) => {
            prev[key as keyof UserAPIRequestFormBody] = val[0].message;
            return prev;
          }, {} as Record<string, string>),
        );
    }
  });

  return (
    <Animated.ScrollView
      onScroll={onScroll}
      style={{ backgroundColor: theme.palette.background.paper }}
      contentContainerStyle={[contentContainerStyle, styles.content]}
    >
      <Box px="l" ml={insets.left} mr={insets.right} style={scrollViewStyle}>
        <KeyboardAvoidingView behavior="padding">
          <Stack
            space="s"
            flex-direction="column"
            maxWidth={moderateScale(480)}
            width="100%"
            align-self="center"
          >
            <Box>
              <Text variant="header-lg">Create an account</Text>
              <Text color="textSecondary" variant="header">
                Join MangaYomu for free and gain features exclusive to users.
              </Text>
            </Box>
            <Field {...register('username')} label="Username" />
            <Field {...register('email')} label="Email address" />
            <Field
              {...register('password')}
              label="Password"
              textContentType="password"
            />
            <Field
              {...register('confirmPassword')}
              label="Confirm password"
              textContentType="password"
            />
            <Stack space="s" my="m">
              <Button
                onPress={onSubmit}
                variant="contained"
                label="Create Account"
              />
              <Pressable onPress={onBack}>
                <Text color="primary" align="right">
                  Already have an account?
                </Text>
              </Pressable>
            </Stack>
          </Stack>
        </KeyboardAvoidingView>
      </Box>
    </Animated.ScrollView>
  );
};

export default Register;
