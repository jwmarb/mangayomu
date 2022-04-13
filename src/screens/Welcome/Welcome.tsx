import { RootStackParamList } from '@navigators/Root/Root.interfaces';
import { StackScreenProps } from '@react-navigation/stack';
import { Button, Flex, Screen, Typography, ResponsiveImage, Spacer } from '@components/core';
import React from 'react';
import { Image, useWindowDimensions, View } from 'react-native';
import Presentation from '@screens/Welcome/components/Presentation/Presentation';
import Slide from './components/Slide';

const slides = [
  () => (
    <>
      <ResponsiveImage
        source={require('../../../assets/images/reading.png')}
        width='90%'
        height='50%'
        resizeMode='contain'
      />
      <Spacer y={4} />

      <Slide>
        <Typography variant='header' bold align='center'>
          Welcome to MangaYomu
        </Typography>
        <Spacer y={2} />
        <Typography color='textSecondary' align='center'>
          Discover and read manga for free
        </Typography>
      </Slide>
    </>
  ),
  () => (
    <>
      <ResponsiveImage
        source={require('../../../assets/images/progressive.png')}
        width='90%'
        height='35%'
        resizeMode='contain'
      />
      <Spacer y={4} />
      <Slide>
        <Typography variant='header' bold align='center'>
          Read anywhere, regardless of device
        </Typography>
        <Spacer y={2} />
        <Typography color='textSecondary' align='center'>
          MangaYomu is also available in the browser, meaning you can read where you left off
        </Typography>
      </Slide>
    </>
  ),
  () => (
    <>
      <ResponsiveImage
        source={require('../../../assets/images/bookshelf.png')}
        width='90%'
        height='50%'
        resizeMode='contain'
      />
      <Spacer y={4} />
      <Slide>
        <Typography variant='header' bold align='center'>
          Variety of sources to read from
        </Typography>
        <Spacer y={2} />
        <Typography color='textSecondary' align='center'>
          If a source does not have the manga you are looking for, there are alternative sources to choose from
        </Typography>
      </Slide>
    </>
  ),
];

const WelcomeScreen: React.FC<StackScreenProps<RootStackParamList, 'Welcome'>> = ({ route, navigation }) => {
  const [screen, setScreen] = React.useState<number>(0);
  function handleOnFinish() {
    navigation.navigate('Home');
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  }

  return (
    <Screen>
      <Presentation
        onFinish={handleOnFinish}
        screens={slides}
        index={screen}
        onPreviousScreen={setScreen}
        onNextScreen={setScreen}
      />
      <Spacer y={1} />
      <Flex justifyContent='center'>
        <Button title='Skip introduction' onPress={handleOnFinish} />
      </Flex>
    </Screen>
  );
};

export default WelcomeScreen;
