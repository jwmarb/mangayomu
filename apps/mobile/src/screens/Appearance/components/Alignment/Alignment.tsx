import Stack from '@components/Stack';
import Text from '@components/Text';
import { TitleAlignment } from '@redux/slices/settings';
import React from 'react';
import { AlignmentProps } from './Alignment.interfaces';
import Box from '@components/Box';
import { ScrollView } from 'react-native-gesture-handler';
import TitleAlignmentPreview from '@screens/Appearance/components/Alignment/components/TitleAlignmentPreview/TitleAlignmentPreview';

const Alignment: React.FC<AlignmentProps> = (props) => {
  const { setTitleAlignment, alignment } = props;
  return (
    <Box pb="s">
      <Box px="l" py="s">
        <Text>Alignment</Text>
      </Box>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <Stack flex-direction="row" space="m" px="l" py="s">
          <TitleAlignmentPreview
            alignItems="flex-start"
            titleAlignment={TitleAlignment.START}
            isSelected={alignment === TitleAlignment.START}
            setTitleAlignment={setTitleAlignment}
          />
          <TitleAlignmentPreview
            alignItems="center"
            titleAlignment={TitleAlignment.CENTER}
            isSelected={alignment === TitleAlignment.CENTER}
            setTitleAlignment={setTitleAlignment}
          />
          <TitleAlignmentPreview
            alignItems="flex-end"
            titleAlignment={TitleAlignment.END}
            isSelected={alignment === TitleAlignment.END}
            setTitleAlignment={setTitleAlignment}
          />
        </Stack>
      </ScrollView>
    </Box>
  );
};

export default Alignment;
