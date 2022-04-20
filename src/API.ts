/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Place = {
  __typename: "Place";
  id: number;
  name: string;
  description?: string | null;
  latitude: number;
  longitude: number;
  parking?: number | null;
  toilet?: number | null;
  createdAt: number;
  updatedAt: number;
};

export type CreatePlaceInput = {
  id: number;
  name: string;
  description?: string | null;
  latitude: number;
  longitude: number;
  parking?: number | null;
  toilet?: number | null;
  createdAt: number;
  updatedAt: number;
};

export type UpdatePlaceInput = {
  id: number;
  name?: string | null;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  parking?: number | null;
  toilet?: number | null;
  createdAt?: number | null;
  updatedAt?: number | null;
};

export type DeletePlaceMutationVariables = {
  id: number;
};

export type DeletePlaceMutation = {
  deletePlace?: {
    __typename: "Place";
    id: number;
    name: string;
    description?: string | null;
    latitude: number;
    longitude: number;
    parking?: number | null;
    toilet?: number | null;
    createdAt: number;
    updatedAt: number;
  } | null;
};

export type CreatePlaceMutationVariables = {
  createPlaceInput: CreatePlaceInput;
};

export type CreatePlaceMutation = {
  createPlace?: {
    __typename: "Place";
    id: number;
    name: string;
    description?: string | null;
    latitude: number;
    longitude: number;
    parking?: number | null;
    toilet?: number | null;
    createdAt: number;
    updatedAt: number;
  } | null;
};

export type UpdatePlaceMutationVariables = {
  updatePlaceInput: UpdatePlaceInput;
};

export type UpdatePlaceMutation = {
  updatePlace?: {
    __typename: "Place";
    id: number;
    name: string;
    description?: string | null;
    latitude: number;
    longitude: number;
    parking?: number | null;
    toilet?: number | null;
    createdAt: number;
    updatedAt: number;
  } | null;
};

export type GetPlaceQueryVariables = {
  id: number;
};

export type GetPlaceQuery = {
  getPlace?: {
    __typename: "Place";
    id: number;
    name: string;
    description?: string | null;
    latitude: number;
    longitude: number;
    parking?: number | null;
    toilet?: number | null;
    createdAt: number;
    updatedAt: number;
  } | null;
};

export type ListPlacesQuery = {
  listPlaces?: Array<{
    __typename: "Place";
    id: number;
    name: string;
    description?: string | null;
    latitude: number;
    longitude: number;
    parking?: number | null;
    toilet?: number | null;
    createdAt: number;
    updatedAt: number;
  } | null> | null;
};

export type OnCreatePlaceSubscription = {
  onCreatePlace?: {
    __typename: "Place";
    id: number;
    name: string;
    description?: string | null;
    latitude: number;
    longitude: number;
    parking?: number | null;
    toilet?: number | null;
    createdAt: number;
    updatedAt: number;
  } | null;
};
