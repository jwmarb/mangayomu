import { StatusIndicatorProps } from '@screens/Home/screens/MangaViewer/components/StatusIndicator/StatusIndicator.interfaces';
import { rem } from '@theme/Typography';
import { Props } from 'react';
import styled, { css } from 'styled-components/native';

export const StatusCircle = styled.View<{ scan: string } | { publish: string }>`
  ${(props) => css`
    background-color: ${props.theme.palette.status[
      'publish' in props
        ? (props['publish'].split(' ')[0].toLowerCase() as unknown as keyof typeof props.theme.palette.status)
        : (props.scan.split(' ')[0].toLowerCase() as unknown as keyof typeof props.theme.palette.status)
    ].get()};
    width: ${rem(8)};
    height: ${rem(8)};
    border-top-left-radius: 100px;
    border-top-right-radius: 100px;
    border-bottom-right-radius: 100px;
    border-bottom-left-radius: 100px;
  `}
`;
