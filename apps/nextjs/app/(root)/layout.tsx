import { RealmProvider } from '@app/context';

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <nav>Navigation</nav>
        <RealmProvider>{children}</RealmProvider>
        <footer>Footer</footer>
      </body>
    </html>
  );
}
