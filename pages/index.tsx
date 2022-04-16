import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
  XIcon,
} from "@heroicons/react/outline";
import { SearchIcon } from "@heroicons/react/solid";
import Script from "next/script";
import { IMapReverseGeocodingResponse } from "@api/map/reverseGeocoding";
import { IDailyWeather, IWeatherDailyResponse } from "@api/weather/daily";
import {
  WiCloud,
  WiDayCloudy,
  WiDayRain,
  WiDayRainMix,
  WiDaySnow,
  WiDaySunny,
  WiDayThunderstorm,
} from "react-icons/wi";

const navigation = [
  { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
  { name: "Team", href: "#", icon: UsersIcon, current: false },
  { name: "Projects", href: "#", icon: FolderIcon, current: false },
  { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
  { name: "Documents", href: "#", icon: InboxIcon, current: false },
  { name: "Reports", href: "#", icon: ChartBarIcon, current: false },
];

interface IPlace {
  name: string;
  description: string;
  facility: {
    parking: number;
    toilet: boolean;
  };
  position: {
    latitude: number;
    longitude: number;
  };
}

const mockPlaceList: Array<IPlace> = [
  {
    name: "길상사",
    description: "최고급 요정에서 도심속 도량으로 환골탈퇴",
    facility: {
      parking: 50,
      toilet: true,
    },
    position: {
      latitude: 37.59895542,
      longitude: 126.9943663,
    },
  },
  {
    name: "반월호수",
    description:
      "순환산책로가 조성되어 있고 아름다운 풍경으로 유명한 장소이다.",
    facility: {
      parking: 50,
      toilet: true,
    },
    position: {
      latitude: 37.32458238,
      longitude: 126.8899642222,
    },
  },
  {
    name: "물누리체험관",
    description: "물과 관련된 다양한 체험프로그램이 있는 물누리체험관",
    facility: {
      parking: 50,
      toilet: true,
    },
    position: {
      latitude: 37.3213650505,
      longitude: 126.8996775289,
    },
  },
  {
    name: "장흥관광지",
    description:
      "계명산과 송추계곡 등의 우수한 자연경관과 양주시립장욱진미술관, 가나아트파크, 송암스페이스센터 등 풍부한 문화예술체험을 동시에 즐길 수 있음",
    facility: {
      parking: 50,
      toilet: true,
    },
    position: {
      latitude: 37.73281632,
      longitude: 126.9492504,
    },
  },
];

const weatherMainMapper = (main: string) => {
  switch (main) {
    case "Thunderstorm":
      return <WiDayThunderstorm className="w-8 h-8" />;
    case "Drizzle":
      return <WiDayRainMix className="w-8 h-8" />;
    case "Rain":
      return <WiDayRain className="w-8 h-8" />;
    case "Snow":
      return <WiDaySnow className="w-8 h-8" />;
    case "Clear":
      return <WiDaySunny className="w-8 h-8" />;
    case "Clouds":
      return <WiDayCloudy className="w-8 h-8" />;
    default:
      return <WiCloud className="w-8 h-8" />;
  }
};

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const mapRef = useRef<naver.maps.Map>();
  const [markerList, setMarkerList] = useState<Array<naver.maps.Marker>>();
  const [placeList, setPlaceList] = useState<Array<IPlace>>([]);
  const [addressName, setAddressName] = useState<string>();
  const [todayWeather, setTodayWeather] = useState<IDailyWeather>();
  const [tomorrowWeather, setTomorrowWeather] = useState<IDailyWeather>();

  const getDailyWeather = useCallback(
    async (latitude: number, longitude: number) => {
      const weatherResponse = await fetch(
        `api/weather/daily?latitude=${latitude}&longitude=${longitude}`
      );
      if (weatherResponse.ok) {
        const weatherJson: IWeatherDailyResponse = await weatherResponse.json();
        setTodayWeather(weatherJson.today);
        setTomorrowWeather(weatherJson.tomorrow);
      }
    },
    []
  );

  const getReverseGeocoding = useCallback(
    async (latitude: number, longitude: number) => {
      const reverseGeocodingResponse = await fetch(
        `api/map/reverseGeocoding?latitude=${latitude}&longitude=${longitude}`
      );
      if (reverseGeocodingResponse.ok) {
        const reverseGeocodingJson: IMapReverseGeocodingResponse =
          await reverseGeocodingResponse.json();
        setAddressName(reverseGeocodingJson.name);
      }
    },
    []
  );

  const searchPlace = useCallback(
    async (word?: string) => {
      if (!mapRef.current) return;
      // destroy old marker list
      markerList?.map((marker) => {
        marker.setMap(null);
      });
      // fetch place list
      const newPlaceList = mockPlaceList;
      // update place list
      setPlaceList(newPlaceList);
      // generate new marker list
      const newMarkerList: Array<naver.maps.Marker> = [];
      newPlaceList.map((place) => {
        newMarkerList.push(
          new naver.maps.Marker({
            position: new naver.maps.LatLng(
              place.position.latitude,
              place.position.longitude
            ),
            map: mapRef.current,
          })
        );
      });
      setMarkerList(newMarkerList);
    },
    [markerList]
  );

  const selectPlace = useCallback(
    async (latitude: number, longitude: number) => {
      if (!mapRef.current) return;
      // move map's center
      const position = new naver.maps.LatLng(latitude, longitude);
      mapRef.current.setCenter(position);
      // update weather and address
      await getDailyWeather(latitude, longitude);
      await getReverseGeocoding(latitude, longitude);
      // open marker
    },
    [getDailyWeather, getReverseGeocoding]
  );

  useEffect(() => {
    // get current geolocation
    navigator.geolocation.getCurrentPosition((position) => {
      (async () => {
        // generate map
        mapRef.current = new naver.maps.Map("map", {
          center: new naver.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          ),
        });
        // add event listener
        naver.maps.Event.addListener(
          mapRef.current,
          "dragend",
          async (event: naver.maps.PointerEvent) => {
            const { y, x } = event.coord;
            await getDailyWeather(y, x);
            await getReverseGeocoding(y, x);
          }
        );
        // get daily weather
        await getDailyWeather(
          position.coords.latitude,
          position.coords.longitude
        );
        // get reverse geocoding
        await getReverseGeocoding(
          position.coords.latitude,
          position.coords.longitude
        );
      })();
    });
  }, [searchPlace, getDailyWeather, getReverseGeocoding]);

  return (
    <>
      {/* Naver map api */}
      <Script
        src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=1jpfqh75nm"
        strategy="beforeInteractive"
      />

      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 flex z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-indigo-700">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-shrink-0 flex items-center px-4">
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-logo-indigo-300-mark-white-text.svg"
                    alt="Workflow"
                  />
                </div>
                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                  <nav className="px-2 space-y-1">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={`
                          ${
                            item.current
                              ? "bg-indigo-800 text-white"
                              : "text-indigo-100 hover:bg-indigo-600"
                          } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                      >
                        <item.icon
                          className="mr-4 flex-shrink-0 h-6 w-6 text-indigo-300"
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:flex md:w-96 md:flex-col md:fixed md:inset-y-0">
          <div className="flex flex-col flex-grow p-6 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <span className="text-3xl font-bold text-primary">어디갈까</span>
            </div>

            {/* Search box */}
            <div className="mt-10">
              <div className="w-full h-10 border-2 border-primary rounded-lg flex justify-between items-center p-4">
                <span className="text-gray-500">장소 이름으로 검색</span>
                <SearchIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="mt-2 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm sm:text-lg">
                  <span className="px-2 bg-white text-gray-500">또는</span>
                </div>
              </div>
              <button
                onClick={async () => {
                  await searchPlace();
                }}
                className="mt-2 w-full h-10 bg-primary hover:bg-primary-dark rounded-lg flex justify-center items-center p-4"
              >
                <span className="text-white font-medium">
                  지금 보고있는 범위에서 검색
                </span>
              </button>
            </div>

            {/* Weather box */}
            <div className="mt-10">
              <span className="block font-semibold text-xl">{addressName}</span>
              <div className="mt-2 flex gap-4 divide-x-2">
                <div className="pl-4 grid grid-cols-2 gap-2 items-center">
                  <div className="flex flex-col place-items-center">
                    {todayWeather && (
                      <span>
                        {weatherMainMapper(todayWeather.weather[0].main)}
                      </span>
                    )}
                    <span>오늘</span>
                  </div>
                  <span>
                    {todayWeather?.temp.min.toFixed(0)} /{" "}
                    {todayWeather?.temp.max.toFixed(0)}
                  </span>
                </div>
                <div className="pl-4 grid grid-cols-2 gap-2 items-center">
                  <div className="flex flex-col place-items-center">
                    {tomorrowWeather && (
                      <span>
                        {weatherMainMapper(tomorrowWeather.weather[0].main)}
                      </span>
                    )}
                    <span>내일</span>
                  </div>
                  <span>
                    {tomorrowWeather?.temp.min.toFixed(0)} /{" "}
                    {tomorrowWeather?.temp.max.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Place list */}
            <div className="mt-10 flex flex-col divide-y-2 border-y-2">
              {placeList.map((place, index) => (
                <button
                  key={index}
                  onClick={() => {
                    selectPlace(
                      place.position.latitude,
                      place.position.longitude
                    );
                  }}
                  className="w-full h-36 py-4 flex flex-col justify-between text-left hover:bg-gray-100"
                >
                  <div>
                    <span className="block text-xl font-semibold">
                      {place.name}
                    </span>
                    <span className="text-lg text-gray-500 line-clamp-2">
                      {place.description}
                    </span>
                  </div>
                  <div className="text-lg">
                    <span className="text-gray-900">주차</span>{" "}
                    <span className="text-primary">
                      {place.facility.parking}대
                    </span>{" "}
                    <span className="text-gray-900">화장실 </span>{" "}
                    <span className="text-primary">
                      {place.facility.toilet ? "있음" : "없음"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map box */}
        <div className="md:pl-96 flex-1">
          <main>
            <div id="map" className="w-full h-screen" />
          </main>
        </div>
      </div>
    </>
  );
};

export default Home;
