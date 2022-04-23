import "../styles/globals.css";
import type { AppProps } from "next/app";
import Amplify from "aws-amplify";
import config from "@src/aws-exports";
import { DefaultSeo } from "next-seo";

Amplify.configure({ ...config, ssr: true });

const defaultSeo = {
  title: "어디가지 | 나들이 장소 찾기",
  description: "주말에 놀러갈 나들이 장소 찾기",
  canonical: "https://main.d2l0whstfhxlrm.amplifyapp.com",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://main.d2l0whstfhxlrm.amplifyapp.com",
    title: "어디가지 | 나들이 장소 찾기",
    site_name: "어디가지",
  },
  twitter: {
    handle: "@handle",
    site: "@site",
    cardType: "summary",
  },
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
