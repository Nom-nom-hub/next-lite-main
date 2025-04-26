// Create this new file
declare namespace NextLite {
  interface GetStaticPropsContext {
    params?: { [key: string]: any };
    preview?: boolean;
    previewData?: any;
  }
  
  type GetStaticProps = (context: GetStaticPropsContext) => Promise<any>;
}