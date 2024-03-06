import useTheme from '@/hooks/useTheme';
import { darkTheme, lightTheme } from '@/providers/theme';
import useIsDarkMode from '@/hooks/useIsDarkMode';

jest.mock('@/hooks/useIsDarkMode', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('dark mode', () => {
  beforeAll(() => {
    (useIsDarkMode as jest.Mock).mockReturnValue(true);
  });

  it('gets correct theme ', () => {
    expect(useTheme()).toEqual(darkTheme);
  });

  it('gets correct theme with contrast', () => {
    expect(useTheme(true)).toEqual(lightTheme);
  });
});

describe('light mode', () => {
  beforeAll(() => {
    (useIsDarkMode as jest.Mock).mockReturnValue(false);
  });

  it('gets correct theme', () => {
    expect(useTheme()).toEqual(lightTheme);
  });

  it('gets correct theme with contrast', () => {
    expect(useTheme(true)).toEqual(darkTheme);
  });
});
