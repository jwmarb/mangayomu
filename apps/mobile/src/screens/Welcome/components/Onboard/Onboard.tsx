import Box from '@components/Box';
import Button from '@components/Button/Button';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import BottomSheet from '@gorhom/bottom-sheet';
import React from 'react';
import { Dimensions, ScrollViewProps } from 'react-native';
import { ScrollView, useWindowDimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
import Page from '@screens/Welcome/components/Page';
import MainSourceSelector from '@screens/Welcome/components/MainSourceSelector';
import useRootNavigation from '@hooks/useRootNavigation';
import useAppSelector from '@hooks/useAppSelector';
import useAuth0 from '@hooks/useAuth0';

const Onboard: React.FC<
  {
    scrollPosition: SharedValue<number>;
  } & Pick<ScrollViewProps, 'onScroll'>
> = React.memo(({ onScroll, scrollPosition }) => {
  const theme = useTheme();
  const navigation = useRootNavigation();
  const { width } = useWindowDimensions();
  const { authorize, user } = useAuth0();
  const ref = React.useRef<ScrollView>(null);
  const bottomSheet = React.useRef<BottomSheet>(null);

  const hostName = useAppSelector((state) => state.host.name);
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
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  }

  async function login() {
    try {
      await authorize({ scope: 'openid profile email' });
    } catch (e) {
      console.error(e);
    }
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
                    Select a main source
                  </Text>
                  <Text align="center" color="textSecondary">
                    This will be your main source. Whenever you open the
                    application, the source's contents will be displayed in
                    Explore page.
                  </Text>
                  <Text align="center" color="textSecondary">
                    You can change this whenever you want.
                  </Text>
                  <Button
                    label={
                      hostName != null
                        ? `Selected: ${hostName}`
                        : 'Select a main source'
                    }
                    variant={hostName != null ? 'outline' : 'contained'}
                    onPress={openMainSourceSelector}
                  />
                  <Button
                    label={
                      hostName == null
                        ? 'Skip for now'
                        : 'Continue to the next step'
                    }
                    variant={hostName == null ? 'text' : 'contained'}
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
                  {user == null && (
                    <Text align="center" color="textSecondary">
                      Simply link a social media account to enable access,
                      though this step is completely optional.
                    </Text>
                  )}
                  {user == null ? (
                    <>
                      <Button
                        label="Link an account"
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
});

const styles = ScaledSheet.create({
  fastImage: {
    width: '350@ms',
    height: '280@ms',
  },
});

export default Onboard;
