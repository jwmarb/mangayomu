import Box from '@components/Box';
import Button from '@components/Button/Button';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import BottomSheet from '@gorhom/bottom-sheet';
import React from 'react';
import { Dimensions } from 'react-native';
import { ScrollView, useWindowDimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
import Page from '@screens/Welcome/components/Page';
import MainSourceSelector from '@screens/Welcome/components/MainSourceSelector';
import useRootNavigation from '@hooks/useRootNavigation';
import connector, {
  ConnectedOnboardProps,
} from '@screens/Welcome/components/Onboard/Onboard.redux';
import { useUser } from '@realm/react';

const Onboard: React.FC<ConnectedOnboardProps> = ({
  onScroll,
  scrollPosition,
  disableWelcomeScreen,
  hostName,
}) => {
  const theme = useTheme();
  const navigation = useRootNavigation();
  const { width } = useWindowDimensions();
  const user = useUser();
  const ref = React.useRef<ScrollView>(null);
  const bottomSheet = React.useRef<BottomSheet>(null);

  const next = () => {
    ref.current?.scrollTo({
      x: (Math.round(scrollPosition.value / width) + 1) * width,
    });
  };
  const scrollViewStyle = React.useMemo(
    () => ({
      backgroundColor: theme.palette.background.default,
      zIndex: -1,
    }),
    [theme],
  );

  const fastImageVisibile = useSharedValue(1);

  const fastImageStyle = useAnimatedStyle(() => ({
    opacity: fastImageVisibile.value,
    position: fastImageVisibile.value === 1 ? 'relative' : 'absolute',
    width: fastImageVisibile.value === 1 ? 'auto' : 0,
    height: fastImageVisibile.value === 1 ? 'auto' : 0,
  }));
  function openMainSourceSelector() {
    bottomSheet.current?.snapToIndex(1);
  }

  function endSetup() {
    disableWelcomeScreen();
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  }

  function login() {
    navigation.push('Login');
  }

  React.useLayoutEffect(() => {
    const p = Dimensions.addEventListener('change', ({ window }) => {
      // window.height = old width
      fastImageVisibile.value = window.width > window.height ? 0 : 1;

      const index = Math.round(scrollPosition.value / window.height);
      const timer = setInterval(
        () => ref.current?.scrollTo({ x: index * window.width }),
        50,
      );
      setTimeout(() => clearInterval(timer), 200);
    });
    return () => {
      p.remove();
    };
  }, []);

  return (
    <>
      <MainSourceSelector ref={bottomSheet} />
      <ScrollView
        ref={ref}
        onScroll={onScroll}
        style={scrollViewStyle}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled
        scrollEnabled={false}
      >
        <Box justify-content="center">
          <Page index={0} scrollPosition={scrollPosition}>
            <Box align-items="center" width={width} mt="xl">
              <Box align-self="center" maxWidth={moderateScale(350)}>
                <Stack space="m">
                  <Text align="center" bold variant="header-lg">
                    Welcome to MangaYomu!
                  </Text>
                  <Text align="center" color="textSecondary">
                    Hey there! Before you start using the app, it is recommended
                    to go through the quick setup.
                  </Text>
                  <Button
                    label="Proceed to setup"
                    variant="contained"
                    onPress={next}
                  />
                  <Button label="Skip setup" onPress={endSetup} />
                </Stack>
              </Box>
            </Box>
          </Page>
        </Box>
        <Box justify-content="center">
          <Page index={1} scrollPosition={scrollPosition}>
            <Box align-items="center" width={width} mt="xl">
              <Box align-self="center" maxWidth={moderateScale(350)}>
                <Stack space="m">
                  <Text align="center" bold variant="header-lg">
                    Select your sources
                  </Text>
                  <Text align="center" color="textSecondary">
                    Whenever you open the application, the source's contents
                    will be displayed in the Explore page.
                  </Text>
                  <Text align="center" color="textSecondary">
                    You can change this whenever you want.
                  </Text>
                  <Button
                    label={
                      hostName.length > 0
                        ? `${hostName.length} source${
                            hostName.length > 1 ? 's' : ''
                          } selected`
                        : 'Open source selector menu'
                    }
                    variant={hostName.length > 0 ? 'outline' : 'contained'}
                    onPress={openMainSourceSelector}
                  />
                  <Button
                    label={
                      hostName.length === 0
                        ? 'Skip for now'
                        : 'Continue to the next step'
                    }
                    variant={hostName.length === 0 ? 'text' : 'contained'}
                    onPress={next}
                  />
                </Stack>
              </Box>
            </Box>
          </Page>
        </Box>
        <Box justify-content="center">
          <Page index={2} scrollPosition={scrollPosition}>
            <Box align-items="center" width={width} mt="xl">
              <Box align-self="center" maxWidth={moderateScale(350)}>
                <Stack space="m">
                  <Text align="center" bold variant="header-lg">
                    MangaYomu Cloud
                  </Text>
                  <Text align="center" color="textSecondary">
                    MangaYomu provides a free cloud storage solution to enable
                    easy access to your manga library anywhere on any device.
                  </Text>
                  {user.profile.name == null && (
                    <Text align="center" color="textSecondary">
                      Simply login with an existing MangaYomu account or with
                      another authentication provider such as Google.
                    </Text>
                  )}
                  {user.profile.name == null ? (
                    <>
                      <Button
                        label="Sign in"
                        onPress={login}
                        variant="contained"
                      />
                      <Button label="Skip for now" onPress={next} />
                    </>
                  ) : (
                    <>
                      <Text align="center" bold>
                        Account successfully linked.
                      </Text>
                      <Button
                        label="Continue to the next step"
                        variant="contained"
                        onPress={next}
                      />
                    </>
                  )}
                </Stack>
              </Box>
            </Box>
          </Page>
        </Box>
        <Box justify-content="center">
          <Page index={3} scrollPosition={scrollPosition}>
            <Box align-items="center" width={width} mt="xl">
              <Box align-self="center" maxWidth={moderateScale(350)}>
                <Stack space="m">
                  <Animated.View style={fastImageStyle}>
                    <FastImage
                      source={require('@assets/reading.png')}
                      resizeMode="contain"
                      style={styles.fastImage}
                    />
                  </Animated.View>
                  <Text align="center" bold variant="header-lg">
                    Setup complete
                  </Text>
                  <Text align="center" color="textSecondary">
                    Thanks for completing the initial setup.
                  </Text>
                  <Button
                    label="Start reading"
                    onPress={endSetup}
                    variant="contained"
                  />
                </Stack>
              </Box>
            </Box>
          </Page>
        </Box>
      </ScrollView>
    </>
  );
};
const styles = ScaledSheet.create({
  fastImage: {
    width: '350@ms' as unknown as number,
    height: '280@ms' as unknown as number,
  },
});

export default connector(React.memo(Onboard));
