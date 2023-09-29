'use client';
import Progress from '@app/components/Progress';
import Text from '@app/components/Text';
import { useReaderSettings } from '@app/context/readersettings';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function Loading() {
  const background = useReaderSettings((s) => s.backgroundColor);
  return (
    <div
      className={`${background} w-[100vw] h-[100vh] flex flex-col items-center justify-center`}
    >
      <Progress size={6} />
    </div>
  );
}
