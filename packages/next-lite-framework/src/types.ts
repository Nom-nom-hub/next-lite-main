import { IncomingMessage, ServerResponse } from 'http';

// Next-Lite Config
export interface NextLiteConfig {
  // Server options
  server?: {
    port?: number;
    host?: string;
  };
  
  // Build options
  build?: {
    target?: string[];
    minify?: boolean;
    sourcemap?: boolean;
    outDir?: string;
  };
  
  // Image optimization options
  images?: {
    domains?: string[];
    deviceSizes?: number[];
    imageSizes?: number[];
    path?: string;
    loader?: 'default' | 'imgix' | 'cloudinary' | 'akamai';
    disableStaticImages?: boolean;
  };
  
  // Experimental features
  experimental?: {
    ssr?: boolean;
    concurrentFeatures?: boolean;
    optimizeCss?: boolean;
    scrollRestoration?: boolean;
  };
  
  // Environment variables to expose to the client
  env?: Record<string, string>;
  
  // Custom webpack config (for compatibility)
  webpack?: (config: any, options: any) => any;
  
  // Custom esbuild config
  esbuild?: Record<string, any>;
}

// API Request
export interface NextApiRequest extends IncomingMessage {
  query: Record<string, string | string[]>;
  cookies: Record<string, string>;
  body: any;
}

// API Response
export interface NextApiResponse<T = any> extends ServerResponse {
  status: (statusCode: number) => NextApiResponse<T>;
  json: (data: T) => void;
  send: (data: T) => void;
  redirect: (statusOrUrl: number | string, url?: string) => void;
}

// API Handler
export type NextApiHandler<T = any> = (
  req: NextApiRequest,
  res: NextApiResponse<T>
) => void | Promise<void>;

// Middleware
export type NextMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => void | Promise<void>;

// GetStaticProps
export type GetStaticProps<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends { [key: string]: string } = { [key: string]: string }
> = (context: {
  params?: Q;
  preview?: boolean;
  previewData?: any;
}) => Promise<{
  props: P;
  revalidate?: number | boolean;
  notFound?: boolean;
}>;

// GetStaticPaths
export type GetStaticPaths<P extends { [key: string]: string } = { [key: string]: string }> = () => Promise<{
  paths: Array<{ params: P }>;
  fallback: boolean | 'blocking';
}>;

// GetServerSideProps
export type GetServerSideProps<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends { [key: string]: string } = { [key: string]: string }
> = (context: {
  req: NextApiRequest;
  res: NextApiResponse;
  params?: Q;
  query: Record<string, string | string[]>;
  preview?: boolean;
  previewData?: any;
}) => Promise<{
  props: P;
  notFound?: boolean;
}>;

// Page component with data fetching
export type NextPage<P = {}, IP = P> = React.FC<P> & {
  getStaticProps?: GetStaticProps<P>;
  getStaticPaths?: GetStaticPaths;
  getServerSideProps?: GetServerSideProps<P>;
};
