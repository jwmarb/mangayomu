import { Providers } from '@app/context';
import '../globals.css';

export default function Layout(props: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {props.children}
          <div id="overlay" />
          <div id="__modal__" />
        </Providers>
      </body>
    </html>
  );
}
