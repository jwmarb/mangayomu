import getSourceManga from '@app/helpers/getSourceManga';
import Reader from './components/reader';
import getSourceChapter from '@app/helpers/getSourceChapter';
import Text from '@app/components/Text';
import getSourceFromSlug from '@app/helpers/getSourceFromSlug';

interface PageProps {
  params: {
    source: string;
    title: string;
    chapter: string;
  };
}

export default async function Page(props: PageProps) {
  // const mangaPathName = props.params.source + '/' + props.params.title;
  // const manga = await getSourceManga(mangaPathName);
  const host = getSourceFromSlug(props.params.source);
  const chapter = await getSourceChapter(
    props.params.source + '/' + props.params.title + '/' + props.params.chapter,
  );

  if (host == null)
    return (
      <div>
        <Text>{props.params.source} does not exist</Text>
      </div>
    );
  if (chapter == null)
    return (
      <div>
        <Text>Does not exist</Text>
      </div>
    );

  return <Reader source={host.name} chapter={chapter} />;
}
