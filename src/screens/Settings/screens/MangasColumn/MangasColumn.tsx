import React from 'react';
import { Slider, Screen, Spacer, Divider, Flex, Icon } from '@components/core';
import Cover from '@components/Manga/Cover';
import { useSelector } from 'react-redux';
import { AppState, useAppDispatch } from '@redux/store';
import { bindActionCreators } from 'redux';
import { adjustColumns as _adjustColumns } from '@redux/reducers/settingsReducer/settingsReducer.actions';
import { useWindowDimensions } from 'react-native';

const MangasColumn: React.FC = (props) => {
  const {} = props;
  const { width } = useWindowDimensions();
  const value = useSelector((state: AppState) => state.settings.mangaCover.perColumn);
  const dispatch = useAppDispatch();
  const { adjustColumns } = bindActionCreators({ adjustColumns: _adjustColumns }, dispatch);

  return (
    <Screen scrollable>
      <Flex container horizontalPadding={3} verticalPadding={0}>
        <Cover uri='https://cover.nep.li/cover/One-Piece.jpg' />
      </Flex>
      <Spacer y={3} />
      <Divider />
      <Flex container horizontalPadding={3} direction='column' alignItems='center'>
        <Slider
          noFixedIncremental
          range={[1, 3]}
          width={width * 0.7}
          value={value}
          onChange={adjustColumns}
          left={<Icon bundle='MaterialCommunityIcons' name='book-minus' size='small' />}
          right={<Icon bundle='MaterialCommunityIcons' name='book-plus' />}
        />
      </Flex>
    </Screen>
  );
};

export default MangasColumn;
