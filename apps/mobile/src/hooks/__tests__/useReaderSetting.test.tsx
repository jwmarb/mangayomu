import { act, render, userEvent, waitFor } from '@testing-library/react-native';
import { Manga as MManga } from '@mangayomu/mangascraper';
import { database } from 'database';
import React from 'react';
import { Button, Text } from 'react-native';
import * as watermelondb from '@nozbe/watermelondb/react';
import { ReactTestInstance } from 'react-test-renderer';
import useReaderSetting from '@/hooks/useReaderSetting';
import { ReadingDirection } from '@/models/schema';
import { Manga } from '@/models/Manga';

afterEach(async () => {
  await database.write(async () => {
    await database.unsafeResetDatabase();
  });
});

const Component: React.FC<{ manga?: MManga }> = ({ manga }) => {
  const { setState, localState, globalState, isLoading } = useReaderSetting(
    'readingDirection',
    manga,
  );

  function handleOnPress() {
    setState(ReadingDirection.WEBTOON);
  }

  if (isLoading) return null;
  return (
    <>
      <Text testID="localState">{localState}</Text>
      <Text testID="globalState">{globalState}</Text>
      <Button title="" testID="btn" onPress={handleOnPress} />
    </>
  );
};

it('modifies global settings', async () => {
  const useDatabaseMock = jest.spyOn(watermelondb, 'useDatabase');
  useDatabaseMock.mockImplementation(() => database);
  // const manga = MangaSee.toManga(tmanga);
  const tree = await waitFor(() => render(<Component />));
  let localStateEl: ReactTestInstance,
    globalStateEl: ReactTestInstance,
    buttonEl!: ReactTestInstance;

  await waitFor(async () => {
    localStateEl = tree.getByTestId('localState');
    globalStateEl = tree.getByTestId('globalState');
    buttonEl = tree.getByTestId('btn');
  });

  expect(localStateEl!).toBeEmptyElement();
  expect(globalStateEl!).toHaveTextContent(`${ReadingDirection.DEFAULT}`);

  jest.useFakeTimers();

  const user = userEvent.setup();

  await act(async () => {
    await user.press(buttonEl);
    await jest.runOnlyPendingTimersAsync();
  });

  jest.useRealTimers();
  await waitFor(async () => {
    localStateEl = tree.getByTestId('localState');
  });

  expect(localStateEl!).toBeEmptyElement();
  expect(globalStateEl!).toHaveTextContent(`${ReadingDirection.WEBTOON}`);
});

it('modifies settings specific for manga', async () => {
  const useDatabaseMock = jest.spyOn(watermelondb, 'useDatabase');
  useDatabaseMock.mockImplementation(() => database);

  const manga: MManga = {
    link: 'https://mangasee123.com/manga/17-Sai-Degree-Celsius',
    title: '17-sai Degree Celsius',
    imageCover: 'https://temp.compsci88.com/cover/17-Sai-Degree-Celsius.jpg',
    source: 'MangaSee',
    language: 'en',
  };

  await Manga.toManga(manga, database);

  const tree = await waitFor(() => render(<Component manga={manga} />));
  let localStateEl: ReactTestInstance,
    globalStateEl: ReactTestInstance,
    buttonEl!: ReactTestInstance;

  await waitFor(async () => {
    localStateEl = tree.getByTestId('localState');
    globalStateEl = tree.getByTestId('globalState');
    buttonEl = tree.getByTestId('btn');
  });

  expect(localStateEl!).toHaveTextContent(`${ReadingDirection.DEFAULT}`);
  expect(globalStateEl!).toHaveTextContent(`${ReadingDirection.DEFAULT}`);

  jest.useFakeTimers();

  const user = userEvent.setup();

  await act(async () => {
    await user.press(buttonEl);
    await jest.runOnlyPendingTimersAsync();
  });

  jest.useRealTimers();
  await waitFor(async () => {
    localStateEl = tree.getByTestId('localState');
  });

  expect(localStateEl!).toHaveTextContent(`${ReadingDirection.WEBTOON}`);
  expect(globalStateEl!).toHaveTextContent(`${ReadingDirection.DEFAULT}`);
});
