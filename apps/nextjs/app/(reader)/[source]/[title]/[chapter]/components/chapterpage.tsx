import React from 'react';

interface ChapterPageProps {
  page: string;
}

function ChapterPage(props: ChapterPageProps) {
  const { page } = props;
  return <img src={page} className="object-contain" />;
}

export default React.memo(ChapterPage);
