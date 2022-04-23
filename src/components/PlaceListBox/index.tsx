import { IPlaceListBoxProps } from "@src/components/PlaceListBox/type";

const PlaceListBox = ({ placeList, selectPlace }: IPlaceListBoxProps) => {
  return (
    <div className="h-full overflow-y-auto flex flex-col divide-y-2 border-y-2 bg-white px-4 rounded-2xl">
      {placeList.map((place, index) => (
        <button
          key={index}
          onClick={async () => {
            await selectPlace(place);
          }}
          className="h-36 py-4 flex flex-col justify-between text-left hover:bg-gray-100"
        >
          <div>
            <span className="block text-xl font-semibold">{place.name}</span>
            <span className="text-lg text-gray-500 line-clamp-2">
              {place.description}
            </span>
          </div>
          <div className="text-lg">
            <span className="text-gray-900">주차</span>{" "}
            <span className="text-primary">
              {place.parking ? `${place.parking}대` : "미확인"}
            </span>{" "}
            <span className="text-gray-900">화장실</span>{" "}
            <span className="text-primary">
              {place.toilet ? "있음" : "없음"}
            </span>
          </div>
        </button>
      ))}
      {placeList.length === 0 && (
        <div className="w-full h-36 py-4">
          <span className="block text-xl text-gray-500">
            검색 결과가 없습니다.
          </span>
        </div>
      )}
    </div>
  );
};

export default PlaceListBox;
