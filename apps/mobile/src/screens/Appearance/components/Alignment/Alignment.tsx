import Stack from '@components/Stack';
import Text from '@components/Text';
import {
  TitleAlignment,
  setTitleAlignment as _setTitleAlignment,
} from '@redux/slices/settings';
import React from 'react';
import Box from '@components/Box';
import { ScrollView } from 'react-native-gesture-handler';
import TitleAlignmentPreview from '@screens/Appearance/components/Alignment/components/TitleAlignmentPreview/TitleAlignmentPreview';
import useAppSelector from '@hooks/useAppSelector';

const Alignment: React.FC = () => {
  const alignment = useAppSelector(
    (state) => state.settings.book.title.alignment,
  );
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
          />
          <TitleAlignmentPreview
            alignItems="center"
            titleAlignment={TitleAlignment.CENTER}
            isSelected={alignment === TitleAlignment.CENTER}
          />
          <TitleAlignmentPreview
            alignItems="flex-end"
            titleAlignment={TitleAlignment.END}
            isSelected={alignment === TitleAlignment.END}
          />
        </Stack>
      </ScrollView>
    </Box>
  );
};

export default Alignment;
