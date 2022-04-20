/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const deletePlace = /* GraphQL */ `
  mutation DeletePlace($id: Int!) {
    deletePlace(id: $id) {
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
export const createPlace = /* GraphQL */ `
  mutation CreatePlace($createPlaceInput: CreatePlaceInput!) {
    createPlace(createPlaceInput: $createPlaceInput) {
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
export const updatePlace = /* GraphQL */ `
  mutation UpdatePlace($updatePlaceInput: UpdatePlaceInput!) {
    updatePlace(updatePlaceInput: $updatePlaceInput) {
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
