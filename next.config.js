/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
    NAVER_CLIENT_SECRET: process.env.NAVER_CLIENT_SECRET,
    OPEN_WEATHER_API_KEY: process.env.OPEN_WEATHER_API_KEY,
  },
  publicRuntimeConfig: {
    WEB_URL: process.env.WEB_URL,
  },
};
