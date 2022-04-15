import type { NextPage } from "next";
import Map from "@src/components/Map";
import ListBox from "@src/components/ListBox";

const Home: NextPage = () => {
  return (
    <div className="flex">
      <ListBox />
      <Map />
    </div>
  );
};

export default Home;
