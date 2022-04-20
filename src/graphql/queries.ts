/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPlace = /* GraphQL */ `
  query GetPlace($id: Int!) {
    getPlace(id: $id) {
      id
      name
      description
      latitude
      longitude
      parking
      toilet
      createdAt
      updatedAt
    }
  }
`;
export const listPlaces = /* GraphQL */ `
  query ListPlaces($name: String) {
    listPlaces(name: $name) {
      id
      name
      description
      latitude
      longitude
      parking
      toilet
      createdAt
      updatedAt
    }
  }
`;
