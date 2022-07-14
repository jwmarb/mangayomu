import ButtonBase from '@components/Button/ButtonBase';
import { Container } from '@components/Container';
import Flex from '@components/Flex';
import { ListItemBase, ListItemSubtitleContainer } from '@components/List/ListItem/ListItem.base';
import { ListItemProps } from '@components/List/ListItem/ListItem.interfaces';
import Spacer from '@components/Spacer';
import { Typography } from '@components/Typography';
import React from 'react';

const ListItem: React.FC<ListItemProps> = (props) => {
  const { title, onPress, typographyProps = {}, adornment, subtitle, adornmentPlacement = 'left' } = props;
  if (onPress)
    return (
      <ListItemBase>
        <ButtonBase expand onPress={onPress} color='primary' square>
          <Flex container verticalPadding={2} horizontalPadding={3} alignItems='center'>
            {adornment && adornmentPlacement === 'left' && (
              <>
                {adornment}
                <Spacer x={3} />
              </>
            )}
            <Flex direction='column' grow>
              <Typography numberOfLines={1} {...typographyProps}>
                {title}
              </Typography>
              {subtitle && (
                <ListItemSubtitleContainer>
                  <Typography variant='body2' color='textSecondary' {...typographyProps}>
                    {subtitle}
                  </Typography>
                </ListItemSubtitleContainer>
              )}
            </Flex>
            {adornment && adornmentPlacement === 'right' && (
              <>
                <Spacer x={3} />
                {adornment}
              </>
            )}
          </Flex>
        </ButtonBase>
      </ListItemBase>
    );

  return (
    <ListItemBase>
      <Flex container verticalPadding={2} horizontalPadding={3} alignItems='center'>
        {adornment && adornmentPlacement === 'left' && (
          <>
            {adornment}
            <Spacer x={3} />
          </>
        )}
        <Flex direction='column' grow>
          <Typography numberOfLines={1} {...typographyProps}>
            {title}
          </Typography>
          {subtitle && (
            <ListItemSubtitleContainer>
              <Typography variant='body2' color='textSecondary' {...typographyProps}>
                {subtitle}
              </Typography>
            </ListItemSubtitleContainer>
          )}
        </Flex>
        {adornment && adornmentPlacement === 'right' && (
          <>
            <Spacer x={3} />
            {adornment}
          </>
        )}
      </Flex>
    </ListItemBase>
  );
};

export default ListItem;
