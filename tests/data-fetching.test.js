/**
 * Tests for data fetching utilities
 */
const { React, render, screen, waitFor } = require('./setup');
const { renderPage } = require('../scripts/ssr');

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: 'test data' }),
  })
);

// Mock component with getServerSideProps
const ServerComponent = ({ data }) => <div>Server Data: {data}</div>;
ServerComponent.getServerSideProps = async () => {
  const res = await fetch('https://api.example.com/data');
  const { data } = await res.json();
  
  return {
    props: {
      data,
    },
  };
};

// Mock component with getStaticProps
const StaticComponent = ({ data }) => <div>Static Data: {data}</div>;
StaticComponent.getStaticProps = async () => {
  const res = await fetch('https://api.example.com/data');
  const { data } = await res.json();
  
  return {
    props: {
      data,
    },
    revalidate: 60,
  };
};

// Mock component with redirect
const RedirectComponent = () => <div>Redirect Page</div>;
RedirectComponent.getServerSideProps = async () => {
  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
};

// Mock component with notFound
const NotFoundComponent = () => <div>Not Found Page</div>;
NotFoundComponent.getServerSideProps = async () => {
  return {
    notFound: true,
  };
};

describe('Data Fetching', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('getServerSideProps fetches data correctly', async () => {
    const context = {
      req: {},
      res: {},
      params: {},
      query: {},
    };
    
    const result = await ServerComponent.getServerSideProps(context);
    
    expect(fetch).toHaveBeenCalledWith('https://api.example.com/data');
    expect(result).toEqual({
      props: {
        data: 'test data',
      },
    });
  });
  
  test('getStaticProps fetches data correctly', async () => {
    const context = {
      params: {},
    };
    
    const result = await StaticComponent.getStaticProps(context);
    
    expect(fetch).toHaveBeenCalledWith('https://api.example.com/data');
    expect(result).toEqual({
      props: {
        data: 'test data',
      },
      revalidate: 60,
    });
  });
  
  test('handles redirect correctly', async () => {
    const context = {
      req: {},
      res: {},
      params: {},
      query: {},
    };
    
    const result = await RedirectComponent.getServerSideProps(context);
    
    expect(result).toEqual({
      redirect: {
        destination: '/login',
        permanent: false,
      },
    });
  });
  
  test('handles notFound correctly', async () => {
    const context = {
      req: {},
      res: {},
      params: {},
      query: {},
    };
    
    const result = await NotFoundComponent.getServerSideProps(context);
    
    expect(result).toEqual({
      notFound: true,
    });
  });
  
  test('renderPage renders component with props', async () => {
    // Mock renderToString
    jest.mock('react-dom/server', () => ({
      renderToString: jest.fn(() => '<div>Server Data: test data</div>'),
    }));
    
    // Mock template
    const template = '<!DOCTYPE html><html><body><div id="root">{{content}}</div></body></html>';
    
    // Mock fs.readFile
    jest.mock('fs-extra', () => ({
      readFile: jest.fn(() => Promise.resolve(template)),
    }));
    
    const html = await renderPage(ServerComponent, {
      req: {},
      res: {},
      params: {},
      query: {},
    });
    
    expect(html).toContain('<div>Server Data: test data</div>');
  });
});
