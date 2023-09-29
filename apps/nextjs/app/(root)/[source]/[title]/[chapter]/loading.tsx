'use client';
import { useReaderSettings } from '@app/context/readersettings';

export default function Loading() {
  const background = useReaderSettings((s) => s.backgroundColor);
  return <div className={`${background} w-[100vw] h-[100vh]`} />;
}
