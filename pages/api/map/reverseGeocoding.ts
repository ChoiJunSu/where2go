// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";

export interface IMapReverseGeocodingRequest {
  latitude: number;
  longitude: number;
}

export interface IMapReverseGeocodingResponse {
  name: string;
}

interface IReverseGeocodingResult {
  name: string;
  region: {
    area1: { name: string };
    area2: { name: string };
    area3: { name: string };
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IMapReverseGeocodingResponse>
) {
  if (req.method === "GET") {
    const { latitude, longitude } = req.query;

    const reverseGeocodingResponse = await fetch(
      `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${longitude},${latitude}&output=json`,
      {
        headers: {
          "X-NCP-APIGW-API-KEY-ID":
            getConfig().serverRuntimeConfig.NAVER_CLIENT_ID,
          "X-NCP-APIGW-API-KEY":
            getConfig().serverRuntimeConfig.NAVER_CLIENT_SECRET,
        },
      }
    );
    if (reverseGeocodingResponse.ok) {
      const reverseGeocodingJson = await reverseGeocodingResponse.json();
      reverseGeocodingJson.results.map(
        ({
          name,
          region: { area1, area2, area3 },
        }: IReverseGeocodingResult) => {
          if (name === "legalcode")
            return res
              .status(200)
              .json({ name: `${area1.name} ${area2.name} ${area3.name}` });
        }
      );
    }

    return res.status(400);
  }
}
