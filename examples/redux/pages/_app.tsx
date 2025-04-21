import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import '../styles/globals.css';

interface AppProps {
  Component: React.ComponentType<any>;
  pageProps: any;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
