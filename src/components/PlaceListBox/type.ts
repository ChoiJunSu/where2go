import { Place } from "@src/API";

export interface IPlaceListBoxProps {
  placeList: Array<Place>;
  selectPlace: (place: Place) => void;
}
