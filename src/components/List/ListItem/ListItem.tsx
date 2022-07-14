import ButtonBase from '@components/Button/ButtonBase';
import { Container } from '@components/Container';
import Flex from '@components/Flex';
import {
  ListAdornmentLeftContainer,
  ListItemBase,
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
        <ButtonBase expand onPress={() => {}} color='primary' square>
          <View>
            <HoldItem items={holdItem} activateOn='tap'>
              <Flex container verticalPadding={2} horizontalPadding={3} alignItems='center'>
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
              </Flex>
            </HoldItem>
          </View>
        </ButtonBase>
      </ListItemBase>
    );
  if (onPress)
    return (
      <ListItemBase>
        <ButtonBase expand onPress={onPress} color='primary' square>
          <Flex container verticalPadding={2} horizontalPadding={3} alignItems='center'>
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
          </Flex>
        </ButtonBase>
      </ListItemBase>
    );

  return (
    <ListItemBase>
      <Flex container verticalPadding={2} horizontalPadding={3} alignItems='center'>
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
      </Flex>
    </ListItemBase>
  );
};

export default ListItem;
