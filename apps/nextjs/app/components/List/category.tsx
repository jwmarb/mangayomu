import React from 'react';

export default function Category({ children }: React.PropsWithChildren) {
  return <div className="flex flex-col">{children}</div>;
}
