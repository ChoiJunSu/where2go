import { ISearchPlaceByPositionBoxProps } from "@src/components/SearchPlaceByPositionBox/type";

const SearchPlaceByPositionBox = ({
  searchPlaceByPosition,
}: ISearchPlaceByPositionBoxProps) => {
  return (
    <div className="shadow-lg">
      <button
        onClick={async () => {
          await searchPlaceByPosition();
        }}
        className="w-full h-12 bg-primary hover:bg-primary-dark rounded-md flex justify-center items-center p-4"
      >
        <span className="text-white text-lg font-medium">
          지금 보고있는 범위에서 검색
        </span>
      </button>
    </div>
  );
};

export default SearchPlaceByPositionBox;
