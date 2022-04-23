import "../styles/globals.css";
import type { AppProps } from "next/app";
import Amplify from "aws-amplify";
import config from "@src/aws-exports";
import { DefaultSeo, DefaultSeoProps } from "next-seo";
import { PUBLIC_URL } from "@src/constants";

Amplify.configure({ ...config, ssr: true });

const defaultSeo: DefaultSeoProps = {
  title: "어디가지 | 나들이 장소 찾기",
  description: "주말에 어디가지? 근교 여행지 알아보기",
  canonical: PUBLIC_URL,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: PUBLIC_URL,
    title: "어디가지 | 나들이 장소 찾기",
    description: "주말에 어디가지? 근교 여행지 알아보기",
    site_name: "어디가지",
    images: [
      {
        url: `${PUBLIC_URL}/picnic.jpg`,
        width: 1920,
        height: 1440,
        alt: "피크닉",
      },
    ],
  },
  additionalMetaTags: [
    { name: "viewport", content: "initial-scale=1, viewport-fit=cover" },
  ],
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...defaultSeo} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
