import { ScrollView } from 'react-native-gesture-handler';
import styled, { css } from 'styled-components/native';
const CategoryHeaderBase = styled.View`
  ${(props) => css`
    padding-horizontal: ${props.theme.spacing(3)};
    flex-grow: 1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `}
`;

export const CategoryHeader: React.FC = ({ children }) => {
  return (
    <ScrollView
      horizontal
      contentContainerStyle={{ flexGrow: 1 }}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      <CategoryHeaderBase>{children}</CategoryHeaderBase>
    </ScrollView>
  );
};
