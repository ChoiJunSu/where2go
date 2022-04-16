// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";

export interface IWeatherDailyRequest {
  latitude: number;
  longitude: number;
}

export interface IWeatherDailyResponse {
  today: IDailyWeather;
  tomorrow: IDailyWeather;
}

export interface IDailyWeather {
  temp: {
    min: number;
    max: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IWeatherDailyResponse>
) {
  if (req.method === "GET") {
    const { latitude, longitude } = req.query;

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&lang=kr&units=metric&appid=${
        getConfig().serverRuntimeConfig.OPEN_WEATHER_API_KEY
      }`
    );
    if (weatherResponse.ok) {
      const weatherJson = await weatherResponse.json();
      let today: IDailyWeather, tomorrow: IDailyWeather;
      weatherJson.daily.map((day: IDailyWeather, index: number) => {
        if (index === 0) today = day;
        if (index === 1) tomorrow = day;
      });

      res.status(200).json({ today: today!, tomorrow: tomorrow! });
    }

    res.status(400);
  }
}
