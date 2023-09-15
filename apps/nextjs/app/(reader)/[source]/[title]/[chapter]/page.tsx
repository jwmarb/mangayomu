import getSourceManga from '@app/helpers/getSourceManga';
import Reader from './components/reader';
import getSourceChapter from '@app/helpers/getSourceChapter';
import Text from '@app/components/Text';
import getSourceFromSlug from '@app/helpers/getSourceFromSlug';
import { getMongooseConnection } from '@mangayomu/backend';

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
  const { connect, close } = getMongooseConnection();
  await connect();
  const [chapter, manga] = await Promise.all([
    getSourceChapter(
      props.params.source +
        '/' +
        props.params.title +
        '/' +
        props.params.chapter,
    ),
    getSourceManga(props.params.source + '/' + props.params.title),
  ]);
  await close();

  if (host == null)
    return (
      <div>
        <Text>{props.params.source} does not exist</Text>
      </div>
    );
  if (chapter == null || manga == null)
    return (
      <div>
        <Text>Does not exist</Text>
      </div>
    );

  return <Reader source={host.name} chapter={chapter} manga={manga} />;
}
