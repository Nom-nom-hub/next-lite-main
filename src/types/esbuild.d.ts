import { Format } from 'esbuild';

declare module 'esbuild' {
  interface BuildOptions {
    format?: string | Format;
  }
}
