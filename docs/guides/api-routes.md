# API Routes in Next-Lite

API routes provide a straightforward solution to build your API directly within your Next-Lite application. Any file inside the `pages/api` directory is mapped to `/api/*` and will be treated as an API endpoint instead of a page.

## Creating API Routes

To create an API route, add a file to the `pages/api` directory:

```js
// pages/api/hello.js
import { createApiHandler } from 'next-lite-framework';

export default createApiHandler((req, res) => {
  res.status(200).json({ message: 'Hello from Next-Lite API!' });
});
```

This creates an API endpoint at `/api/hello` that returns a JSON response.

## Request and Response Objects

API routes receive two objects as parameters:

1. `req`: An instance of the HTTP request object
2. `res`: An instance of the HTTP response object

### Request Object (`req`)

The `req` object includes:

- `req.method`: The HTTP method of the request (GET, POST, etc.)
- `req.query`: An object containing the query string parameters
- `req.cookies`: An object containing the cookies sent by the request
- `req.body`: The request body (if parsed, requires additional setup)
- `req.headers`: The request headers

### Response Object (`res`)

The `res` object includes methods for sending responses:

- `res.status(code)`: Sets the HTTP status code
- `res.json(body)`: Sends a JSON response
- `res.send(body)`: Sends a response
- `res.redirect([status,] path)`: Redirects to a specified path
- `res.setHeader(name, value)`: Sets a response header

## HTTP Methods

You can handle different HTTP methods in your API routes:

```js
import { createApiHandler } from 'next-lite-framework';

export default createApiHandler((req, res) => {
  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    case 'PUT':
      return handlePut(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
});

function handleGet(req, res) {
  res.status(200).json({ message: 'GET request handled' });
}

function handlePost(req, res) {
  res.status(201).json({ message: 'POST request handled' });
}

function handlePut(req, res) {
  res.status(200).json({ message: 'PUT request handled' });
}

function handleDelete(req, res) {
  res.status(200).json({ message: 'DELETE request handled' });
}
```

## Dynamic API Routes

Like pages, API routes can be dynamic:

```js
// pages/api/users/[id].js
import { createApiHandler } from 'next-lite-framework';

export default createApiHandler((req, res) => {
  const { id } = req.query;
  
  res.status(200).json({ id, name: `User ${id}` });
});
```

This creates API endpoints for `/api/users/1`, `/api/users/2`, etc.

## Error Handling

It's important to handle errors in your API routes:

```js
import { createApiHandler } from 'next-lite-framework';

export default createApiHandler(async (req, res) => {
  try {
    // Database or external API call that might fail
    const data = await fetchData();
    res.status(200).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
```

## TypeScript Support

API routes work great with TypeScript:

```ts
// pages/api/users.ts
import { NextApiRequest, NextApiResponse } from 'next-lite-framework/types';
import { createApiHandler } from 'next-lite-framework';

type User = {
  id: number;
  name: string;
};

export default createApiHandler((req: NextApiRequest, res: NextApiResponse<User[] | { error: string }>) => {
  if (req.method === 'GET') {
    const users: User[] = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
    ];
    
    res.status(200).json(users);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
});
```

## CORS Configuration

To enable CORS (Cross-Origin Resource Sharing) in your API routes:

```js
import { createApiHandler } from 'next-lite-framework';

export default createApiHandler((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Handle actual request
  res.status(200).json({ message: 'API response with CORS enabled' });
});
```

## Best Practices

1. **Validate Input**: Always validate user input to prevent security issues
2. **Use HTTP Methods Correctly**: Follow RESTful conventions
3. **Handle Errors**: Implement proper error handling
4. **Set Appropriate Status Codes**: Use the correct HTTP status codes
5. **Secure Your API**: Implement authentication and authorization as needed

## Next Steps

- [Data Fetching](./data-fetching.md) - Learn how to fetch data in Next-Lite
- [TypeScript](./typescript.md) - Using TypeScript with Next-Lite
- [createApiHandler API](../api/create-api-handler.md) - API reference for createApiHandler
