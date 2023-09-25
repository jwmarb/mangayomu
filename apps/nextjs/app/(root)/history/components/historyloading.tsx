import Book from '@app/components/Book';
import Text from '@app/components/Text';

export default function HistoryLoading() {
  return (
    <>
      <div className="mx-4 my-3">
        <Text.Skeleton className="w-36 font-bold -z-50" />
      </div>
      <HistoryEntryLoading />
      <HistoryEntryLoading />
      <div className="mx-4 my-3">
        <Text.Skeleton className="w-36 font-bold -z-50" />
      </div>
      <HistoryEntryLoading />
      <div className="mx-4 my-3">
        <Text.Skeleton className="w-36 font-bold -z-50" />
      </div>
      <HistoryEntryLoading />
      <HistoryEntryLoading />
      <HistoryEntryLoading />
      <div className="mx-4 my-3">
        <Text.Skeleton className="w-36 font-bold -z-50" />
      </div>
      <HistoryEntryLoading />
      <HistoryEntryLoading />
      <HistoryEntryLoading />
      <HistoryEntryLoading />
      <div className="mx-4 my-3">
        <Text.Skeleton className="w-36 font-bold -z-50" />
      </div>

      <HistoryEntryLoading />
      <HistoryEntryLoading />
    </>
  );
}

function HistoryEntryLoading() {
  return (
    <div className="flex flex-row items-center gap-2 px-4 m-1 -z-50">
      <Book.Cover.Skeleton compact />
      <div className="flex flex-col md:w-[40%] w-[80%]">
        <Text.Skeleton
          className="font-bold max-w-[100%]"
          variant="book-title"
        />
        <div className="flex flex-row gap-2 flex-shrink">
          <Text.Skeleton />
          <Text color="text-secondary">•</Text>
          <Text.Skeleton className="font-bold max-w-[65%]" />
        </div>
      </div>
    </div>
  );
}
