import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import Image from "next/image";
import { IMapReverseGeocodingResponse } from "@api/map/reverseGeocoding";
import { IDailyWeather, IWeatherDailyResponse } from "@api/weather/daily";
import { API, graphqlOperation } from "aws-amplify";
import { listPlaces } from "@src/graphql/queries";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import { Place } from "@src/API";
import MapBox from "@components/MapBox";
import SearchPlaceByWordBox from "@components/SearchPlaceByWordBox";
import SearchPlaceByPositionBox from "@components/SearchPlaceByPositionBox";
import WeatherBox from "@components/WeatherBox";
import PlaceListBox from "@components/PlaceListBox";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { isMobile } from "react-device-detect";
import { COLOR } from "@src/constants";

const Home = () => {
  const [mobileSidebarState, setMobileSidebarState] = useState<
    "full" | "min" | "hidden"
  >("hidden");
  const mapRef = useRef<naver.maps.Map>();
  const infoWindowRef = useRef<naver.maps.InfoWindow>();
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
              <div style="padding: 0.5em 1em; font-weight: bold; color: ${COLOR.SECONDARY}; background-color: white; border: solid; border-width: 3px; border-color: ${COLOR.SECONDARY}; border-radius: 20px; box-shadow: 2px 2px 4px gray; white-space: nowrap; overflow: hidden;"
                onmouseover="this.style.backgroundColor='${COLOR.SECONDARY}'; this.style.color='white'"
                onmouseleave="this.style.backgroundColor='white'; this.style.color='${COLOR.SECONDARY}'">
                    ${place.name}
              </div>`,
          },
        });
        const naverMapUrl = "https://map.naver.com/v5/search/" + place.name;
        const instagramUrl = "https://instagram.com/explore/tags/" + place.name;
        naver.maps.Event.addListener(marker, "click", async () => {
          // float marker
          marker.setZIndex(1);
          // open info window
          infoWindowRef.current!.setContent(`
            <div style="padding: 1em; max-width: 15em; box-shadow: 1px 1px 4px gray;">
              <span style="display: block; margin-bottom: 0.5rem; font-size: 1.25rem; font-weight: bold; color: ${
                COLOR.SECONDARY
              }">${place.name}</span>
              <span>?????? </span>
              <span style="font-weight: bold;">${
                place.parking ? `${place.parking} ` : "????????? "
              }</span>
              <span>${place.parking ? "???" : ""}</span>
              <span style="color: gray"> / </span>
              <span>????????? </span>
              <span style="font-weight: bold;">${
                place.toilet ? "??????" : "??????"
              }</span>
              <div style="display: block; margin: 1rem 0 0">
              <a href="${
                isMobile ? naverMapUrl : naverMapUrl + "/place"
              }" target="_blank"
              >
              <img alt="????????????????????? ??????" style="display: inline; height: 32px; width: 32px; border: 2px solid gray; border-radius: 8px;" onmouseover="this.style.border='2px solid ${
                COLOR.SECONDARY
              }';" onmouseleave="this.style.border='2px solid gray';" src="/navermaps.png" />
              </a>
              <a href="${instagramUrl}" target="_blank">
              <img alt="????????????????????? ??????" style="display: inline; margin: 0 0.5rem; height: 32px; width: 32px; border: 2px solid gray; border-radius: 8px;" onmouseover="this.style.border='2px solid ${
                COLOR.SECONDARY
              }';" onmouseleave="this.style.border='2px solid gray';" src="/instagram.png" />
              </a>
              </div>
          </div>`);
          infoWindowRef.current!.open(mapRef.current!, marker);
          // close mobile sidebar
          setMobileSidebarState("min");
        });
        newMarkerList[place.name] = marker;
      });
      // set new marker list
      setMarkerList(newMarkerList);
    },
    [markerList]
  );

  const searchPlaceByWord = useCallback(
    async (searchPlaceWord: string) => {
      if (!mapRef.current || !searchPlaceWord) return;
      // close info window
      infoWindowRef.current?.close();
      // fetch place list
      const listPlacesResult = (await API.graphql(
        graphqlOperation(listPlaces, {
          name: searchPlaceWord,
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
      // open mobile sidebar
      setMobileSidebarState("min");
    },
    [updateMarkerList]
  );

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
    // open mobile sidebar
    setMobileSidebarState("min");
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
      // close mobile sidebar
      setMobileSidebarState("min");
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
        borderWidth: 0,
        pixelOffset: new naver.maps.Point(50, -10),
        disableAnchor: true,
      });
      // add event listener for click
      naver.maps.Event.addListener(mapRef.current, "click", () => {
        infoWindowRef.current!.close();
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
      <div className="h-screen-safe md:h-screen">
        {/*<div className="h-screen md:h-screen">*/}
        {/* Naver map api */}
        <Script
          src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=1jpfqh75nm"
          strategy="beforeInteractive"
        />

        {/* Sidebar for desktop */}
        <div className="hidden md:flex flex-col w-96 h-full fixed inset-y-0">
          <div className="h-full flex flex-col flex-grow p-6">
            {/* Logo */}
            <div className="flex gap-2 items-center flex-shrink-0">
              <Image src="/icon.png" width="48" height="48" />
              <span className="text-3xl font-bold text-primary">????????????</span>
            </div>

            {/* Search box */}
            <div className="mt-10">
              <SearchPlaceByWordBox searchPlaceByWord={searchPlaceByWord} />
              <div className="mt-2 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm sm:text-lg">
                  <span className="px-2 bg-gray-50 text-gray-500">??????</span>
                </div>
              </div>
              <div className="mt-2">
                <SearchPlaceByPositionBox
                  searchPlaceByPosition={searchPlaceByPosition}
                />
              </div>
            </div>

            {/* Weather box */}
            {addressName && todayWeather && tomorrowWeather && (
              <div className="mt-10">
                <WeatherBox
                  addressName={addressName}
                  todayWeather={todayWeather}
                  tomorrowWeather={tomorrowWeather}
                />
              </div>
            )}

            {/* Place list */}
            <div className="mt-10 h-full">
              <PlaceListBox placeList={placeList} selectPlace={selectPlace} />
            </div>
          </div>
        </div>

        <div className="relative md:ml-96 flex-1 h-full">
          {mobileSidebarState === "hidden" && (
            <>
              {/* Search by word box for mobile */}
              <div className="md:hidden w-full px-4 absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                <SearchPlaceByWordBox searchPlaceByWord={searchPlaceByWord} />
              </div>

              {/* Search by position box for mobile */}
              <div className="md:hidden w-full px-4 absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                <SearchPlaceByPositionBox
                  searchPlaceByPosition={searchPlaceByPosition}
                />
              </div>
            </>
          )}

          {/* Sidebar for mobile */}
          {mobileSidebarState !== "hidden" && (
            <>
              {/* Back button */}
              <button
                onClick={() => {
                  setMobileSidebarState("hidden");
                }}
                className="md:hidden absolute z-10 top-4 left-4 bg-white p-2 rounded-full shadow-lg"
              >
                <ArrowLeftIcon className="w-6 h-6 text-primary" />
              </button>

              {/* Place list box */}
              <div
                className={`md:hidden absolute z-10 bottom-0 w-full flex flex-col ${
                  mobileSidebarState === "full"
                    ? "h-5/6"
                    : mobileSidebarState === "min"
                    ? "h-1/5"
                    : ""
                }`}
              >
                {/* Up button */}
                {mobileSidebarState === "min" && (
                  <button
                    onClick={() => {
                      setMobileSidebarState("full");
                    }}
                    className="md:hidden w-20 mx-auto z-10 bg-white p-2 rounded-full shadow-lg transform -translate-y-4"
                  >
                    <span className="text-primary font-medium">????????????</span>
                  </button>
                )}

                {/* Down button */}
                {mobileSidebarState === "full" && (
                  <button
                    onClick={() => {
                      setMobileSidebarState("min");
                    }}
                    className="md:hidden w-20 mx-auto z-10 bg-white p-2 rounded-full shadow-lg transform -translate-y-4"
                  >
                    <span className="text-primary font-medium">????????????</span>
                  </button>
                )}

                <PlaceListBox placeList={placeList} selectPlace={selectPlace} />
              </div>
            </>
          )}

          {/* Map box */}
          <MapBox />
        </div>
      </div>
    </>
  );
};

export default Home;
