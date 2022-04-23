import { IDailyWeather } from "@api/weather/daily";

export interface IWeatherBoxProps {
  addressName: string;
  todayWeather: IDailyWeather;
  tomorrowWeather: IDailyWeather;
}
