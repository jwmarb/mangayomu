import { Providers } from '@app/context';
import '../globals.css';

export default function Layout(props: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div id="__modal__" />
          {props.children}
        </Providers>
      </body>
    </html>
  );
}
