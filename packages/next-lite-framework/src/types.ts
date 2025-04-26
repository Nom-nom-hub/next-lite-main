import { IncomingMessage, ServerResponse } from 'http';
import React from 'react';

// NextLiteConfig
export interface NextLiteConfig {
  server: {
    port: number;
    host: string;
  };
  build: {
    target: string[];
    minify: boolean;
    sourcemap: boolean;
    outDir: string;
  };
  esbuild?: {
    // Add esbuild specific options here
    splitting?: boolean;
    format?: string;
    chunkNames?: string;
  };
  images: {
    domains: string[];
    deviceSizes: number[];
    imageSizes: number[];
    path: string;
    loader: string;
  };
  experimental: {
    ssr: boolean;
    concurrentFeatures: boolean;
    optimizeCss: boolean;
    scrollRestoration: boolean;
  };
  env?: Record<string, string>;
}

// API types
export interface NextApiRequest extends IncomingMessage {
  query: Record<string, string | string[]>;
  cookies: Record<string, string>;
  body: any;
}

export interface NextApiResponse<T = any> extends ServerResponse {
  json: (body: T) => void;
  status: (statusCode: number) => NextApiResponse<T>;
  send: (body: T) => void;
  // The ServerResponse already has writeHead, end, etc.
}

export type NextApiHandler<T = any> = (
  req: NextApiRequest,
  res: NextApiResponse<T>
) => void | Promise<void>;

// Middleware
export type NextMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: (err?: any) => void
) => void | Promise<void>;

// SSR types
export type GetServerSideProps<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends { [key: string]: any } = { [key: string]: any }
> = (context: {
  req: NextApiRequest;
  res: NextApiResponse;
  params?: Q;
  query: Record<string, string | string[]>;
}) => Promise<{ props: P; notFound?: boolean }>;

export type GetStaticProps<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends { [key: string]: any } = { [key: string]: any }
> = (context: {
  params?: Q;
}) => Promise<{ props: P; revalidate?: number; notFound?: boolean }>;

export type GetStaticPaths = () => Promise<{
  paths: Array<{ params: { [key: string]: string } }>;
  fallback: boolean | 'blocking';
}>;

// Page context
export interface NextPageContext {
  req?: IncomingMessage;
  res?: ServerResponse;
  pathname: string;
  query: Record<string, string | string[]>;
  asPath?: string;
}

// NextPage
export interface NextPage<P = {}, IP = P> extends React.FC<P> {
  getInitialProps?: (context: NextPageContext) => Promise<IP> | IP;
}
