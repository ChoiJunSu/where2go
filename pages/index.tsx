import {
  createElement,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import Script from "next/script";
import { IMapReverseGeocodingResponse } from "@api/map/reverseGeocoding";
import { IDailyWeather, IWeatherDailyResponse } from "@api/weather/daily";
import {
  WiCloud,
  WiDaySunny,
  WiRain,
  WiRainMix,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";
import { API, graphqlOperation } from "aws-amplify";
import { listPlaces } from "@src/graphql/queries";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import { Place } from "@src/API";

const navigation = [
  { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
  { name: "Team", href: "#", icon: UsersIcon, current: false },
  { name: "Projects", href: "#", icon: FolderIcon, current: false },
  { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
  { name: "Documents", href: "#", icon: InboxIcon, current: false },
  { name: "Reports", href: "#", icon: ChartBarIcon, current: false },
];

const weatherMainMapper = (main: string) => {
  switch (main) {
    case "Thunderstorm":
      return <WiThunderstorm className="w-8 h-8 text-gray-600" />;
    case "Drizzle":
      return <WiRainMix className="w-8 h-8 text-gray-600" />;
    case "Rain":
      return <WiRain className="w-8 h-8 text-gray-600" />;
    case "Snow":
      return <WiSnow className="w-8 h-8 text-gray-600" />;
    case "Clear":
      return <WiDaySunny className="w-8 h-8 text-orange-600" />;
    case "Clouds":
      return <WiCloud className="w-8 h-8 text-sky-700" />;
    default:
      return <WiCloud className="w-8 h-8 text-gray-600" />;
  }
};

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const mapRef = useRef<naver.maps.Map>();
  const infoWindowRef = useRef<naver.maps.InfoWindow>();
  const searchPlaceWordRef = useRef<HTMLInputElement | null>(null);
  const [markerList, setMarkerList] = useState<
    Record<string, naver.maps.Marker>
  >({});
  const [placeList, setPlaceList] = useState<Array<Place>>([]);
  const [addressName, setAddressName] = useState<string>();
  const [todayWeather, setTodayWeather] = useState<IDailyWeather>();
  const [tomorrowWeather, setTomorrowWeather] = useState<IDailyWeather>();

  const getDailyWeather = useCallback(
    async (latitude: number, longitude: number) => {
      const weatherResponse = await fetch(
        `/api/weather/daily?latitude=${latitude}&longitude=${longitude}`
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
        `/api/map/reverseGeocoding?latitude=${latitude}&longitude=${longitude}`
      );
      if (reverseGeocodingResponse.ok) {
        const reverseGeocodingJson: IMapReverseGeocodingResponse =
          await reverseGeocodingResponse.json();
        setAddressName(reverseGeocodingJson.name);
      }
    },
    []
  );

  const updateMarkerList = useCallback(
    (newPlaceList: Array<Place>) => {
      if (!mapRef.current || !infoWindowRef.current) return;
      // destroy old marker list
      Object.keys(markerList).map((key) => {
        markerList[key].setMap(null);
      });
      // generate new marker list
      const newMarkerList: Record<string, naver.maps.Marker> = {};
      newPlaceList.map((place) => {
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(place.latitude, place.longitude),
          map: mapRef.current,
          animation: naver.maps.Animation.DROP,
          title: place.name,
          icon: {
            content: `
              <div style="padding: 0.5em; color: white; background-color: #2aa090; border-radius: 10px; box-shadow: 2px 2px 4px grey; white-space: nowrap; overflow: hidden;"
                onmouseover="this.style.backgroundColor='#23877a'"
                onmouseleave="this.style.backgroundColor='#2aa090'">
                    ${place.name}
              </div>`,
          },
        });
        naver.maps.Event.addListener(marker, "click", () => {
          marker.setZIndex(1);
          infoWindowRef.current!.setContent(`
            <div style="padding: 0.5em; max-width: 15em">
            <span style="font-weight: bold">${place.name}</span>
            <p style="color: grey">${place.description}</p>
            <span>주차 </span>
            <span style="color: #2aa090">${
              place.parking ? `${place.parking}대 ` : "미확인 "
            }</span>
            <span>화장실 </span>
            <span style="color: #2aa090">${
              place.toilet ? "있음" : "없음"
            }</span>
          </div>`);
          infoWindowRef.current!.open(mapRef.current!, marker);
        });
        newMarkerList[place.name] = marker;
      });
      // set new marker list
      setMarkerList(newMarkerList);
    },
    [markerList]
  );

  const searchPlaceByWord = useCallback(async () => {
    if (
      !mapRef.current ||
      !searchPlaceWordRef.current ||
      !searchPlaceWordRef.current.value
    )
      return;
    // close info window
    infoWindowRef.current?.close();
    // fetch place list
    const listPlacesResult = (await API.graphql(
      graphqlOperation(listPlaces, {
        name: searchPlaceWordRef.current.value,
      })
    )) as GraphQLResult<{ listPlaces: Array<Place> }>;
    if (!listPlacesResult.data || !listPlacesResult.data.listPlaces) return;
    const newPlaceList = listPlacesResult.data.listPlaces;
    // change map's center and zoom: center of South Korea
    mapRef.current.setCenter(new naver.maps.LatLng(36.3491175, 127.7615482));
    mapRef.current.setZoom(7);
    // update place list
    setPlaceList(newPlaceList);
    // update marker list
    updateMarkerList(newPlaceList);
  }, [updateMarkerList]);

  const searchPlaceByPosition = useCallback(async () => {
    if (!mapRef.current) return;
    // close info window
    infoWindowRef.current?.close();
    // get map boundary
    const bounds = mapRef.current.getBounds() as naver.maps.LatLngBounds;
    // fetch place list
    const listPlacesResult = (await API.graphql(
      graphqlOperation(listPlaces, {
        neLat: bounds.getNE().lat(),
        neLng: bounds.getNE().lng(),
        swLat: bounds.getSW().lat(),
        swLng: bounds.getSW().lng(),
      })
    )) as GraphQLResult<{ listPlaces: Array<Place> }>;
    if (!listPlacesResult.data || !listPlacesResult.data.listPlaces) return;
    const newPlaceList = listPlacesResult.data.listPlaces;
    // update place list
    setPlaceList(newPlaceList);
    // update marker list
    updateMarkerList(newPlaceList);
  }, [updateMarkerList]);

  const selectPlace = useCallback(
    async (place: Place) => {
      if (!mapRef.current) return;
      // move map's center and zoom
      const position = new naver.maps.LatLng(place.latitude, place.longitude);
      mapRef.current.setCenter(position);
      mapRef.current.setZoom(14);
      // update weather and address
      await getDailyWeather(place.latitude, place.longitude);
      await getReverseGeocoding(place.latitude, place.longitude);
      // open info window
      naver.maps.Event.trigger(markerList[place.name], "click");
    },
    [getDailyWeather, getReverseGeocoding, markerList]
  );

  useEffect(() => {
    // init center position: Seoul
    const centerPosition = {
      latitude: 37.564214,
      longitude: 127.001699,
    };
    // get current geolocation
    navigator.geolocation.getCurrentPosition((position) => {
      centerPosition.latitude = position.coords.latitude;
      centerPosition.longitude = position.coords.longitude;
    });
    (async () => {
      // generate map
      mapRef.current = new naver.maps.Map("map", {
        center: new naver.maps.LatLng(
          centerPosition.latitude,
          centerPosition.longitude
        ),
        zoom: 11,
      });
      // generate info window
      infoWindowRef.current = new naver.maps.InfoWindow({
        content: "",
        borderColor: "#2aa090",
        borderWidth: 2,
        pixelOffset: new naver.maps.Point(30, -10),
        disableAnchor: true,
      });
      // add event listener for click
      naver.maps.Event.addListener(mapRef.current, "click", () => {
        infoWindowRef.current?.close();
      });
      // add event listener for drag end
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
      await getDailyWeather(centerPosition.latitude, centerPosition.longitude);
      // get reverse geocoding
      await getReverseGeocoding(
        centerPosition.latitude,
        centerPosition.longitude
      );
    })();
  }, []);

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
              <span className="text-3xl font-bold text-primary">어디가지</span>
            </div>

            {/* Search box */}
            <div className="mt-10">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await searchPlaceByWord();
                }}
                className="flex gap-2 justify-between"
              >
                <input
                  ref={searchPlaceWordRef}
                  type="text"
                  placeholder="장소 이름으로 검색"
                  className="appearance-none w-full h-10 border-2 border-primary focus:outline-primary-dark rounded-lg flex justify-between items-center p-4"
                />
                <button className="shrink-0 px-4 py-2 rounded-lg text-white bg-primary hover:bg-primary-dark">
                  검색
                </button>
              </form>
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
                  await searchPlaceByPosition();
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
                  onClick={async () => {
                    await selectPlace(place);
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
                      {place.parking ? `${place.parking}대` : "미확인"}
                    </span>{" "}
                    <span className="text-gray-900">화장실</span>{" "}
                    <span className="text-primary">
                      {place.toilet ? "있음" : "없음"}
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
