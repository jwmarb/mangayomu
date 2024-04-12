import { CustomBlockRenderer } from 'react-native-render-html';
import useSynopsisExpandedContext from '@/screens/MangaView/hooks/useSynopsisExpandedContext';

export const bodyRenderer: CustomBlockRenderer = ({
  TDefaultRenderer,
  ...rest
}) => {
  const isExpanded = useSynopsisExpandedContext();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!isExpanded) (rest.tnode as any).children = [rest.tnode.children[0]]; // All children other than the first element (assumed to be a text node)
  return <TDefaultRenderer {...rest} />;
};
