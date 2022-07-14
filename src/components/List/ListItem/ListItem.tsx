import ButtonBase from '@components/Button/ButtonBase';
import { Container } from '@components/Container';
import Flex from '@components/Flex';
import {
  ListAdornmentLeftContainer,
  ListItemBase,
  ListItemButtonBaseContainer,
  ListItemSubtitleContainer,
} from '@components/List/ListItem/ListItem.base';
import { ListItemProps } from '@components/List/ListItem/ListItem.interfaces';
import Spacer from '@components/Spacer';
import { Typography } from '@components/Typography';
import React from 'react';
import { View } from 'react-native';
import { HoldItem } from 'react-native-hold-menu';

const ListItem: React.FC<ListItemProps> = (props) => {
  const { title, onPress, typographyProps = {}, adornment, subtitle, adornmentPlacement = 'left', holdItem } = props;
  if (holdItem)
    return (
      <ListItemBase>
        <HoldItem items={holdItem} activateOn='tap'>
          <ButtonBase expand onPress={() => {}} color='primary' square>
            <ListItemButtonBaseContainer>
              <ListAdornmentLeftContainer>
                {adornment && adornmentPlacement === 'left' && <>{adornment}</>}
              </ListAdornmentLeftContainer>
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
            </ListItemButtonBaseContainer>
          </ButtonBase>
        </HoldItem>
      </ListItemBase>
    );
  if (onPress)
    return (
      <ListItemBase>
        <ButtonBase expand onPress={onPress} color='primary' square>
          <ListItemButtonBaseContainer>
            <ListAdornmentLeftContainer>
              {adornment && adornmentPlacement === 'left' && <>{adornment}</>}
            </ListAdornmentLeftContainer>
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
          </ListItemButtonBaseContainer>
        </ButtonBase>
      </ListItemBase>
    );

  return (
    <ListItemBase>
      <ListItemButtonBaseContainer>
        <ListAdornmentLeftContainer>
          {adornment && adornmentPlacement === 'left' && <>{adornment}</>}
        </ListAdornmentLeftContainer>

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
      </ListItemButtonBaseContainer>
    </ListItemBase>
  );
};

export default ListItem;
