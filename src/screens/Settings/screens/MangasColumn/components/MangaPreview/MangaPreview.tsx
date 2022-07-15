import { Typography, Spacer } from '@components/core';
import React from 'react';
import connector, {
  ConnectedMangaPreviewProps,
} from '@screens/Settings/screens/MangasColumn/components/MangaPreview/MangaPreview.redux';
import {
  MangaCoverPreviewContainer,
  MangaCoverPreview,
} from '@screens/Settings/screens/MangasColumn/MangasColumn.base';
import { MangaCoverStyles } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import { ModernMangaCoverContainer } from './MangaPreview.base';
import { ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Constants } from '@theme/core';

const MangaPreview: React.FC<ConnectedMangaPreviewProps> = (props) => {
  const { uri, imageStyle, style, title, textStyle, bold, coverStyle } = props;
  switch (coverStyle) {
    case MangaCoverStyles.MODERN:
      return (
        <MangaCoverPreviewContainer style={style}>
          <ModernMangaCoverContainer style={imageStyle}>
            <ImageBackground
              source={{ uri }}
              style={{ width: '100%', height: '100%' }}
              imageStyle={{ borderRadius: 4 }}>
              <LinearGradient
                colors={['transparent', Constants.GRAY[12].get()]}
                style={{ height: '100%', justifyContent: 'flex-end', padding: 8 }}>
                <Typography style={textStyle} numberOfLines={2} bold={bold}>
                  {title}
                </Typography>
              </LinearGradient>
            </ImageBackground>
          </ModernMangaCoverContainer>
        </MangaCoverPreviewContainer>
      );
    case MangaCoverStyles.CLASSIC:
    default:
      return (
        <MangaCoverPreviewContainer style={style}>
          <MangaCoverPreview source={{ uri }} style={imageStyle} />
          <Spacer y={1} />
          <Typography style={textStyle} numberOfLines={2} bold={bold}>
            {title}
          </Typography>
        </MangaCoverPreviewContainer>
      );
  }
};

export default connector(React.memo(MangaPreview));
