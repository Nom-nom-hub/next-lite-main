import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from '../lib/apollo-client';
import '../styles/globals.css';

interface AppProps {
  Component: React.ComponentType<any>;
  pageProps: any;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
