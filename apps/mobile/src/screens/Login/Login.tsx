import Box from '@components/Box';
import Button from '@components/Button';
import Checkbox from '@components/Checkbox';
import Divider from '@components/Divider';
import Input from '@components/Input';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import useBoolean from '@hooks/useBoolean';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

const styles = StyleSheet.create({
  content: {
    height: '100%',
    paddingTop: '50%',
  },
});

const Login: React.FC = () => {
  const { onScroll, contentContainerStyle } = useCollapsibleHeader({
    headerTitle: '',
  });

  const theme = useTheme();

  return (
    <Animated.ScrollView
      onScroll={onScroll}
      contentContainerStyle={[
        contentContainerStyle,
        styles.content,
        { backgroundColor: theme.palette.background.paper },
      ]}
    >
      <Stack
        space="s"
        flex-direction="column"
        left={0}
        right={0}
        top={0}
        bottom={0}
        mx="l"
      >
        <Text variant="header-lg" align="center">
          Sign into your account
        </Text>
        <Stack space="s">
          <Text>Username or email</Text>
          <Input
            width="100%"
            placeholder="Username or email"
            textContentType="username"
          />
        </Stack>
        <Stack space="s">
          <Text>Password</Text>
          <Input
            width="100%"
            placeholder="Password"
            textContentType="password"
          />
        </Stack>
        <Box my="s" align-self="flex-end">
          <Pressable onPress={() => console.log('pressed')}>
            <Text color="primary">Forgot password?</Text>
          </Pressable>
        </Box>
        <Button label="Login" variant="contained" />
        <Box align-self="flex-end" flex-direction="row">
          <Text color="textSecondary">Don't have an account? </Text>
          <Pressable>
            <Text color="primary">Register here</Text>
          </Pressable>
        </Box>
        <Stack space="s" my="s" flex-direction="row">
          <Divider shrink align-self="center" />
          <Text color="textSecondary">or use another provider</Text>
          <Divider shrink align-self="center" />
        </Stack>
      </Stack>
    </Animated.ScrollView>
  );
};

export default Login;
