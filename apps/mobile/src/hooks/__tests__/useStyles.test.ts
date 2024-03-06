/* eslint-disable @typescript-eslint/no-unused-vars */
import 'react-native';
import { render } from '@testing-library/react-native';
import { createStyles } from '@/utils/theme';
import useStyles from '@/hooks/useStyles';
import useIsDarkMode from '@/hooks/useIsDarkMode';

type MockTheme = {
  primary: string;
};

const LIGHT_PRIMARY = 'lightcolor';
const DARK_PRIMARY = 'darkcolor';

jest.mock('../../providers/theme', () => ({
  lightTheme: { primary: LIGHT_PRIMARY },
  darkTheme: { primary: DARK_PRIMARY },
}));

jest.mock('../useIsDarkMode', () => ({
  __esModule: true,
  default: jest.fn(),
}));

let styles: readonly [
  {
    container: {
      backgroundColor: string;
    };
  },
  {
    container: {
      backgroundColor: string;
    };
  },
];

beforeAll(() => {
  styles = createStyles((theme) => ({
    container: {
      backgroundColor: (theme as unknown as MockTheme).primary,
    },
  }));
});

describe('dark mode on device initially', () => {
  beforeAll(() => {
    (useIsDarkMode as jest.Mock).mockReturnValue(true);
  });
  it('returns correct themed styles', () => {
    const style = useStyles(styles);
    expect(style).toEqual({
      container: {
        backgroundColor: DARK_PRIMARY,
      },
    });
  });
  it('returns correct contrast themed styles', () => {
    const style = useStyles(styles, true);
    expect(style).toEqual({
      container: {
        backgroundColor: LIGHT_PRIMARY,
      },
    });
  });
});

describe('light mode on device initially', () => {
  beforeAll(() => {
    (useIsDarkMode as jest.Mock).mockReturnValue(false);
  });
  it('returns correct themed styles', () => {
    const style = useStyles(styles);
    expect(style).toEqual({
      container: {
        backgroundColor: LIGHT_PRIMARY,
      },
    });
  });
  it('returns correct contrast themed styles', () => {
    const style = useStyles(styles, true);
    expect(style).toEqual({
      container: {
        backgroundColor: DARK_PRIMARY,
      },
    });
  });
});
