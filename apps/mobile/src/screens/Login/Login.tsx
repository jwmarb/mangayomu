import Box from '@components/Box';
import Button from '@components/Button';
import Divider from '@components/Divider';
import Field from '@components/Field';
import Realm from 'realm';
import Progress from '@components/Progress';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import displayMessage from '@helpers/displayMessage';
import useBoolean from '@hooks/useBoolean';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import useForm from '@hooks/useForm';
import { RootStackProps } from '@navigators/Root/Root.interfaces';
import { useApp, useRealm, useUser } from '@realm/react';
import axios from 'axios';
import { BACKEND_URL } from 'env';
import { GOOGLE_OAUTH2_ID } from '@env';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import zod from 'zod';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
  NativeModuleError,
} from '@react-native-google-signin/google-signin';
import RNRestart from 'react-native-restart';
import useDialog from '@hooks/useDialog';

GoogleSignin.configure({
  webClientId: GOOGLE_OAUTH2_ID,
  offlineAccess: true,
});

const styles = StyleSheet.create({
  content: {
    minHeight: '100%',
    justifyContent: 'center',
  },
});

const formSchema = zod.object({
  username: zod.string().min(1, 'A username or email is required'),
  password: zod.string().min(1, 'A password is required'),
});

type FormInput = zod.infer<typeof formSchema>;

const Login: React.FC<RootStackProps<'Login'>> = ({ navigation }) => {
  const { onScroll, contentContainerStyle, scrollViewStyle } =
    useCollapsibleHeader({
      headerTitle: '',
    });

  const [isInvalid, toggleInvalid] = useBoolean();
  const [loading, toggleLoading] = useBoolean();
  const user = useUser();
  const app = useApp();
  const dialog = useDialog();

  const { register, handleSubmit, setError } = useForm<FormInput>(formSchema);

  const theme = useTheme();

  const insets = useSafeAreaInsets();

  const handleOnRegister = () => {
    navigation.navigate('Register');
  };

  async function loginUser(credentials: Realm.Credentials) {
    try {
      await user.linkCredentials(credentials);
    } catch {
      await app.logIn(credentials);
      promptRestart();
    }
  }

  const promptRestart = () =>
    dialog.open({
      title: 'App restart required',
      message: 'A restart is required to sync data with this user',
      actions: [
        {
          text: 'Not now',
        },
        {
          text: 'Restart',
          onPress: () => {
            RNRestart.restart();
          },
          variant: 'contained',
        },
      ],
    });

  const handleOnLogin = handleSubmit(async (value) => {
    toggleInvalid(false);
    toggleLoading(true);
    try {
      const { data } = await axios.post<{ id_token: string }>(
        BACKEND_URL + '/api/v1/auth',
        value,
      );
      const credentials = Realm.Credentials.jwt(data.id_token);
      await loginUser(credentials);
      displayMessage('Successfully logged in');
      if (navigation.canGoBack()) navigation.goBack();
    } catch (e) {
      console.error(e);
      setError({
        username: true,
        password: true,
      });
      toggleInvalid(true);
    } finally {
      toggleLoading(false);
    }
  });

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      toggleLoading(true);
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.idToken != null) {
        const googleCredentials = Realm.Credentials.google({
          idToken: userInfo.idToken,
        });
        await loginUser(googleCredentials);
        displayMessage('Successfully logged in');
        if (navigation.canGoBack()) navigation.goBack();
      } else displayMessage('Google Sign-in failed');
    } catch (e) {
      const error = e as NativeModuleError;
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        displayMessage('Login cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        displayMessage('Please wait for login to complete');
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        displayMessage('Google Play Services is not available');
      } else {
        // some other error happened
        console.error(e);
      }
    } finally {
      toggleLoading(false);
    }
  };

  return (
    <Animated.ScrollView
      onScroll={onScroll}
      style={{ backgroundColor: theme.palette.background.paper }}
      contentContainerStyle={[contentContainerStyle, styles.content]}
    >
      <Box px="l" ml={insets.left} mr={insets.right} style={scrollViewStyle}>
        <Stack
          space="s"
          flex-direction="column"
          maxWidth={moderateScale(480)}
          width="100%"
          align-self="center"
          align-items="center"
        >
          <Text variant="header-lg" align="center">
            Sign into your account
          </Text>
          <Field {...register('username')} label="Username or email" />
          <Field
            {...register('password')}
            label="Password"
            textContentType="password"
            onSubmitEditing={handleOnLogin}
          />
          {isInvalid && (
            <Text align="center" color="error">
              Invalid username or password
            </Text>
          )}
          <Box my="s" align-self="flex-end">
            <Pressable onPress={() => console.log('pressed')}>
              <Text color="primary">Forgot password?</Text>
            </Pressable>
          </Box>
          <Button
            onPress={handleOnLogin}
            label="Login"
            variant="contained"
            disabled={loading}
            icon={loading ? <Progress size="small" /> : undefined}
          />
          <Box align-self="flex-end" flex-direction="row">
            <Text color="textSecondary">Don't have an account? </Text>
            <Pressable onPress={handleOnRegister}>
              <Text color="primary">Register here</Text>
            </Pressable>
          </Box>
          <Stack space="s" my="s" flex-direction="row">
            <Divider shrink align-self="center" />
            <Text color="textSecondary">or use another provider</Text>
            <Divider shrink align-self="center" />
          </Stack>
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={
              GoogleSigninButton.Color[theme.mode === 'dark' ? 'Dark' : 'Light']
            }
            onPress={signIn}
            disabled={loading}
          />
        </Stack>
      </Box>
    </Animated.ScrollView>
  );
};

export default Login;
