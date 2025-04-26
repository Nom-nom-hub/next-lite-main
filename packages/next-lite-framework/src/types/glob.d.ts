declare module 'glob' {
  function sync(pattern: string, options?: any): string[];
  function glob(pattern: string, options?: any, cb?: (err: Error | null, matches: string[]) => void): void;
  namespace glob {
    function sync(pattern: string, options?: any): string[];
  }
  export = glob;
}