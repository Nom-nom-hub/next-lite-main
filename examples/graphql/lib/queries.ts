import { gql } from '@apollo/client';

// Query to get all films
export const GET_FILMS = gql`
  query GetFilms {
    allFilms {
      films {
        id
        title
        releaseDate
        director
        episodeID
      }
    }
  }
`;

// Query to get a specific film by ID
export const GET_FILM = gql`
  query GetFilm($id: ID!) {
    film(id: $id) {
      id
      title
      episodeID
      openingCrawl
      director
      producers
      releaseDate
      created
      edited
      characters {
        id
        name
      }
      planets {
        id
        name
      }
      species {
        id
        name
      }
      starships {
        id
        name
      }
      vehicles {
        id
        name
      }
    }
  }
`;

// Query to get all people
export const GET_PEOPLE = gql`
  query GetPeople {
    allPeople {
      people {
        id
        name
        birthYear
        gender
        homeworld {
          name
        }
        species {
          name
        }
      }
    }
  }
`;

// Query to get a specific person by ID
export const GET_PERSON = gql`
  query GetPerson($id: ID!) {
    person(id: $id) {
      id
      name
      birthYear
      eyeColor
      gender
      hairColor
      height
      mass
      skinColor
      homeworld {
        id
        name
      }
      species {
        id
        name
      }
      filmConnection {
        films {
          id
          title
        }
      }
      starshipConnection {
        starships {
          id
          name
        }
      }
      vehicleConnection {
        vehicles {
          id
          name
        }
      }
    }
  }
`;
