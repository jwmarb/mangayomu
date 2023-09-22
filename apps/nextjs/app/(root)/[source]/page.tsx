import BackButton from '@app/(root)/[source]/components/backbutton';
import SourceViewer from '@app/(root)/[source]/components/sourceviewer';
import Screen from '@app/components/Screen';
import Text from '@app/components/Text';
import getSourceFromSlug from '@app/helpers/getSourceFromSlug';
import Image from 'next/image';
import { TbError404 } from 'react-icons/tb';

interface PageProps {
  params: {
    source: string;
  };
}

export default async function Page(props: PageProps) {
  const host = getSourceFromSlug(props.params.source);

  if (host == null)
    return (
      <Screen>
        <Screen.Content className="flex flex-col justify-center items-center">
          <TbError404 className="text-error w-20 h-20" />
          <Text variant="header-emphasized" className="text-center">
            Not found
          </Text>
          <span className="flex flex-row">
            <Text color="text-secondary" className="text-center">
              This page does not exist. Perhaps there is a typo?
            </Text>
          </span>
        </Screen.Content>
      </Screen>
    );

  return (
    <Screen>
      <SourceViewer source={host.name} />
    </Screen>
  );
}
