'use client';
import BackButton from '@app/(root)/[source]/components/backbutton';
import Screen from '@app/components/Screen';
import Text from '@app/components/Text';
import TextField from '@app/components/TextField';
import { MangaHost } from '@mangayomu/mangascraper';
import Image from 'next/image';

export default function SourceViewerHeader(props: { host: MangaHost }) {
  const { host } = props;
  return (
    <Screen.Header className="flex flex-col gap-2 pb-2">
      <div className="flex flex-row gap-4 items-center">
        <BackButton />
        <div className="flex flex-row gap-2 items-center">
          <div className="w-6 h-6 relative">
            <Image
              alt={`${host.name} icon`}
              src={host.icon}
              fill
              loading="lazy"
            />
          </div>
          <Text className="font-medium">{host.name}</Text>
        </div>
      </div>
      <TextField className="w-full" />
    </Screen.Header>
  );
}
