import '../globals.css';
import Route from '@app/components/LayoutRoute';
import { Providers } from '@app/context';

export default function Layout(props: React.PropsWithChildren) {
  return (
    <html lang="en">
      <Providers>
        <Route.body>
          <Route.layout>{props.children}</Route.layout>
        </Route.body>
      </Providers>
    </html>
  );
}
