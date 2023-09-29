import { Providers } from '@app/context';
import '../globals.css';
import Navbar from '@app/(root)/components/navbar';
import SafeArea from '@app/(root)/components/safearea';
import React from 'react';
import Text from '@app/components/Text';
import RouteWrapper from '@app/context/routewrapper';

export interface RootLayoutProps extends React.PropsWithChildren {
  paper?: boolean;
}

function RootLayout({ children, paper }: RootLayoutProps) {
  return (
    <html lang="en">
      <RouteWrapper paper={paper}>
        <Providers paper={paper}>{children}</Providers>
      </RouteWrapper>
    </html>
  );
}

export default function generateLayout(layout?: RootLayoutProps) {
  async function Layout(props: React.PropsWithChildren) {
    return <RootLayout {...props} {...layout} />;
  }

  return Layout;
}
