import ButtonBase from '@components/Button/ButtonBase';
import { Container } from '@components/Container';
import Flex from '@components/Flex';
import { ListItemBase } from '@components/List/ListItem/ListItem.base';
import { ListItemProps } from '@components/List/ListItem/ListItem.interfaces';
import Spacer from '@components/Spacer';
import { Typography } from '@components/Typography';
import React from 'react';

const ListItem: React.FC<ListItemProps> = (props) => {
  const { title, onPress = () => void 0, typographyProps = {}, adornment } = props;

  return (
    <ListItemBase>
      <ButtonBase expand onPress={onPress} color='primary' square>
        <Flex container verticalPadding={1.75} horizontalPadding={2.5} alignItems='center'>
          {adornment && (
            <>
              {adornment}
              <Spacer x={2} />
            </>
          )}
          <Typography variant='body2' numberOfLines={1} {...typographyProps}>
            {title}
          </Typography>
        </Flex>
      </ButtonBase>
    </ListItemBase>
  );
};

export default ListItem;
