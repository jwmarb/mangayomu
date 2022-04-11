import { FlexProps } from '@components/Flex/Flex.interfaces';
import styled, { css } from 'styled-components/native';
import { FlexBase } from '@components/Flex/Flex.base';
import React from 'react';
import Spacer from '@components/Spacer';

const Flex: React.FC<FlexProps> = (props) => {
  const { spacing } = props;
  if (spacing != null)
    return (
      <FlexBase {...props}>
        {React.Children.map(props.children, (child, index) => {
          if (React.isValidElement(child)) {
            switch (index) {
              case React.Children.toArray(props.children).length - 1:
                return <>{child}</>;
              default:
                switch (props.direction) {
                  case 'column':
                  case 'column-reverse':
                    return (
                      <>
                        {child}
                        <Spacer y={spacing} />
                      </>
                    );
                  default:

                  case 'row':
                  case 'row-reverse':
                    return (
                      <>
                        {child}
                        <Spacer x={spacing} />
                      </>
                    );
                }
            }
          }
        })}
      </FlexBase>
    );
  return <FlexBase {...props} />;
};

export default Flex;
