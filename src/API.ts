/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Place = {
  __typename: "Place",
  id: number,
  name: string,
  description?: string | null,
  latitude: number,
  longitude: number,
  parking?: number | null,
  toilet?: boolean | null,
  createdAt: string,
  updatedAt: string,
};

export type CreatePlaceInput = {
  id?: number | null,
  name: string,
  description?: string | null,
  latitude: number,
  longitude: number,
  parking?: number | null,
  toilet?: boolean | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type UpdatePlaceInput = {
  id: number,
  name?: string | null,
  description?: string | null,
  latitude?: number | null,
  longitude?: number | null,
  parking?: number | null,
  toilet?: boolean | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeletePlaceMutationVariables = {
  id: number,
};

export type DeletePlaceMutation = {
  deletePlace?:  {
    __typename: "Place",
    id: number,
    name: string,
    description?: string | null,
    latitude: number,
    longitude: number,
    parking?: number | null,
    toilet?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreatePlaceMutationVariables = {
  createPlaceInput: CreatePlaceInput,
};

export type CreatePlaceMutation = {
  createPlace?:  {
    __typename: "Place",
    id: number,
    name: string,
    description?: string | null,
    latitude: number,
    longitude: number,
    parking?: number | null,
    toilet?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdatePlaceMutationVariables = {
  updatePlaceInput: UpdatePlaceInput,
};

export type UpdatePlaceMutation = {
  updatePlace?:  {
    __typename: "Place",
    id: number,
    name: string,
    description?: string | null,
    latitude: number,
    longitude: number,
    parking?: number | null,
    toilet?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetPlaceQueryVariables = {
  id: number,
};

export type GetPlaceQuery = {
  getPlace?:  {
    __typename: "Place",
    id: number,
    name: string,
    description?: string | null,
    latitude: number,
    longitude: number,
    parking?: number | null,
    toilet?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListPlacesQueryVariables = {
  name?: string | null,
  neLat?: number | null,
  neLng?: number | null,
  swLat?: number | null,
  swLng?: number | null,
};

export type ListPlacesQuery = {
  listPlaces?:  Array< {
    __typename: "Place",
    id: number,
    name: string,
    description?: string | null,
    latitude: number,
    longitude: number,
    parking?: number | null,
    toilet?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null > | null,
};

export type OnCreatePlaceSubscription = {
  onCreatePlace?:  {
    __typename: "Place",
    id: number,
    name: string,
    description?: string | null,
    latitude: number,
    longitude: number,
    parking?: number | null,
    toilet?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
