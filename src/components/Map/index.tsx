import { useEffect } from "react";
import Script from "next/script";

const Map = () => {
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const map = new naver.maps.Map("map", {
        center: new naver.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        ),
      });
    });
  }, []);

  return (
    <div className="w-full h-screen">
      <Script
        src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=1jpfqh75nm"
        strategy="beforeInteractive"
      />
      <div id="map" className="w-full h-full"></div>
    </div>
  );
};

export default Map;
