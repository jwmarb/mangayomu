import _ScreenBase from './screen';
import Header from './header';
import Content from './content';

const Screen = _ScreenBase as typeof _ScreenBase & {
  Header: typeof Header;
  Content: typeof Content;
};

Screen.Header = Header;
Screen.Content = Content;

export default Screen;
