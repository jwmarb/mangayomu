import React from 'react';

interface ChapterPageProps {
  page: string;
}

function ChapterPage(props: ChapterPageProps) {
  const { page } = props;
  return <img src={page} className="max-h-[100vh]" />;
}

export default React.memo(ChapterPage);
