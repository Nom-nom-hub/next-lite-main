import '../styles/globals.css';
import type { AppProps } from 'next-lite-framework/types';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return <Component {...pageProps} />;
}

export default MyApp;
