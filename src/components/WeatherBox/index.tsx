import { IWeatherBoxProps } from "@src/components/WeatherBox/type";
import {
  WiCloud,
  WiDaySunny,
  WiRain,
  WiRainMix,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";

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

const WeatherBox = ({
  addressName,
  todayWeather,
  tomorrowWeather,
}: IWeatherBoxProps) => {
  return (
    <div>
      <span className="block font-semibold text-xl">{addressName}</span>
      <div className="mt-2 flex gap-4 divide-x-2">
        <div className="pl-4 grid grid-cols-2 gap-2 items-center">
          <div className="flex flex-col place-items-center">
            <span>{weatherMainMapper(todayWeather.weather[0].main)}</span>
            <span>오늘</span>
          </div>
          <span>
            {todayWeather.temp.min.toFixed(0)} /{" "}
            {todayWeather.temp.max.toFixed(0)}
          </span>
        </div>
        <div className="pl-4 grid grid-cols-2 gap-2 items-center">
          <div className="flex flex-col place-items-center">
            <span>{weatherMainMapper(tomorrowWeather.weather[0].main)}</span>
            <span>내일</span>
          </div>
          <span>
            {tomorrowWeather.temp.min.toFixed(0)} /{" "}
            {tomorrowWeather.temp.max.toFixed(0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeatherBox;
