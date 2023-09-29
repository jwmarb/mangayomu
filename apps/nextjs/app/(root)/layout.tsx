import '../globals.css';
import Route from '@app/components/LayoutRoute';
import { Providers } from '@app/context';

export default function Layout(props: React.PropsWithChildren) {
  return (
    <html lang="en">
      <Route.body>
        <Providers>
          <Route.layout>{props.children}</Route.layout>
        </Providers>
      </Route.body>
    </html>
  );
}
