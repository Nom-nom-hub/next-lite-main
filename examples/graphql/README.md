# Next-Lite with GraphQL

This example shows how to integrate [GraphQL](https://graphql.org) with Next-Lite using [Apollo Client](https://www.apollographql.com/docs/react/).

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

This example uses Apollo Client to fetch data from the [SWAPI GraphQL API](https://graphql.org/swapi-graphql), which provides Star Wars data. The application displays a list of Star Wars films and allows you to view details about each film and its characters.

### Files

- `lib/apollo-client.ts`: Apollo Client configuration
- `lib/queries.ts`: GraphQL queries
- `components/FilmList.tsx`: Component to display a list of films
- `components/FilmDetail.tsx`: Component to display details about a film
- `components/CharacterDetail.tsx`: Component to display details about a character
- `pages/_app.tsx`: Application wrapper with Apollo Provider
- `pages/index.tsx`: Home page with film list
- `pages/films/[id].tsx`: Film detail page
- `pages/characters/[id].tsx`: Character detail page

### Dependencies

- `@apollo/client`: Apollo Client for GraphQL
- `graphql`: GraphQL library

## Learn More

To learn more about GraphQL and Apollo Client, take a look at the following resources:

- [GraphQL Documentation](https://graphql.org) - learn about GraphQL.
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/) - learn about Apollo Client.
- [Next-Lite Documentation](https://github.com/teckcode/next-lite/tree/main/docs) - learn about Next-Lite features and API.

## Deploy

You can deploy this example to any static hosting service or Node.js hosting platform.
