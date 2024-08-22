import { useSynopsisExpanded } from '@/screens/MangaView/context';
import { CustomBlockRenderer } from 'react-native-render-html';

export const bodyRenderer: CustomBlockRenderer = ({
  TDefaultRenderer,
  ...rest
}) => {
  const isExpanded = useSynopsisExpanded();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!isExpanded) (rest.tnode as any).children = [rest.tnode.children[0]]; // All children other than the first element (assumed to be a text node)
  return <TDefaultRenderer {...rest} />;
};
