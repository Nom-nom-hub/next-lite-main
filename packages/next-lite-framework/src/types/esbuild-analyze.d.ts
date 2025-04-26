declare module 'esbuild-analyze' {
  function analyze(metafile: any): any;
  namespace analyze {
    function buildHtml(metafile: any): string;
  }
  export = analyze;
}
