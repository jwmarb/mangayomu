import useLazyLoading from '@hooks/useLazyLoading';
import { useIsFocused } from '@react-navigation/native';
import { AppState } from '@redux/store';
import HistoryEmpty from '@screens/Home/screens/History/components/HistoryEmpty';
import { renderSectionHeader, keyExtractor, renderItem } from '@screens/Home/screens/History/History.flatlist';
import pixelToNumber from '@utils/pixelToNumber';
import { format, formatDistanceToNow, isThisWeek, isToday } from 'date-fns';
import React from 'react';
import { SectionList, useWindowDimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { useTheme } from 'styled-components/native';
const dateFormatter = (date: number) => {
  if (isToday(date)) return 'Today';
  else if (isThisWeek(date)) return formatDistanceToNow(date, { addSuffix: true });
  else return format(date, 'MMM d, yyyy');
};

const History: React.FC = (props) => {
  const {} = props;
  const { height } = useWindowDimensions();
  const sectionList = useSelector((state: AppState) => state.history.sectionListData);
  const sectionData = React.useMemo(() => {
    const reverseMap = [];
    for (let i = sectionList.length - 1; i >= 0; i--) {
      reverseMap.push({ title: dateFormatter(sectionList[i].date), data: sectionList[i].data.toArray() });
    }
    return reverseMap;
  }, [sectionList]);
  const theme = useTheme();

  return (
    <SectionList
      ListEmptyComponent={<HistoryEmpty />}
      sections={sectionData}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={keyExtractor}
      contentContainerStyle={{
        paddingTop: pixelToNumber(theme.spacing(2)),
        paddingBottom: pixelToNumber(theme.spacing(24)),
        minHeight: height,
      }}
    />
  );
};

export default function () {
  const { ready, Fallback } = useLazyLoading();
  if (ready) return <History />;
  return Fallback;
}
