import Box from '@components/Box';
import Button from '@components/Button';
import Icon from '@components/Icon';
import Skeleton from '@components/Skeleton';
import Stack from '@components/Stack';
import Text from '@components/Text';
import React from 'react';
import { NativeSyntheticEvent, TextLayoutEventData } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { MangaDescriptionProps } from './MangaDescription.interfaces';

const MAX_NUMBER_OF_LINES = 7;

const MangaDescription: React.FC<MangaDescriptionProps> = (props) => {
  const { data, loading } = props;
  const [numberOfLines, setNumberOfLines] = React.useState<number | undefined>(
    MAX_NUMBER_OF_LINES,
  );
  const isExpanded = numberOfLines == null;
  const [showExpand, setShowExpand] = React.useState<boolean>(false);
  function handleOnTextLayout(e: NativeSyntheticEvent<TextLayoutEventData>) {
    setShowExpand(e.nativeEvent.lines.length > MAX_NUMBER_OF_LINES);
  }
  function handleOnShowMore() {
    if (!isExpanded) setNumberOfLines(undefined);
    else setNumberOfLines(MAX_NUMBER_OF_LINES);
  }
  return (
    <Stack space="s">
      <Stack
        flex-direction="row"
        space="s"
        justify-content="space-between"
        align-items="center"
      >
        <Text variant="header" bold>
          Synopsis
        </Text>
        {showExpand && (
          <Button
            iconPlacement="right"
            label={isExpanded ? 'Hide' : 'Expand'}
            icon={
              <Icon
                type="font"
                name={isExpanded ? 'chevron-down' : 'chevron-up'}
              />
            }
            onPress={handleOnShowMore}
          />
        )}
      </Stack>

      {data == null && loading ? (
        <>
          <Skeleton>
            <Text>Placeholder</Text>
          </Skeleton>
          <Skeleton>
            <Text>Placeholder</Text>
          </Skeleton>
          <Skeleton>
            <Text>Placeholder</Text>
          </Skeleton>
          <Skeleton>
            <Text>Placeholder</Text>
          </Skeleton>
          <Skeleton>
            <Text>Placeholder</Text>
          </Skeleton>
        </>
      ) : (
        <Text
          color="textSecondary"
          italic={!data}
          onTextLayout={handleOnTextLayout}
          numberOfLines={numberOfLines}
        >
          {data || 'No description available.'}
        </Text>
      )}
    </Stack>
  );
};

export default React.memo(MangaDescription);
