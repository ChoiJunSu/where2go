import { ISearchPlaceByWordBoxProps } from "@src/components/SearchPlaceByWordBox/type";
import { ForwardedRef, forwardRef, useState } from "react";

const SearchPlaceByWordBox = forwardRef(
  (
    { searchPlaceByWord }: ISearchPlaceByWordBoxProps,
    searchPlaceWordRef: ForwardedRef<HTMLInputElement>
  ) => {
    const [searchPlaceWord, setSearchPlaceWord] = useState<string>("");

    return (
      <div className="shadow-lg">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await searchPlaceByWord(searchPlaceWord);
          }}
          className="flex"
        >
          <input
            ref={searchPlaceWordRef}
            type="text"
            placeholder="장소 이름으로 검색"
            onChange={(e) => {
              setSearchPlaceWord(e.target.value);
            }}
            className="appearance-none w-full h-12 border-2 border-r-0 rounded-md rounded-r-none border-primary focus:outline-none flex justify-between items-center p-4"
          />
          <button className="shrink-0 px-4 py-2 rounded-md rounded-l-none text-white text-lg bg-primary hover:bg-primary-dark">
            검색
          </button>
        </form>
      </div>
    );
  }
);

SearchPlaceByWordBox.displayName = "SearchPlaceByWordBox";

export default SearchPlaceByWordBox;
