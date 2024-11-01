/*
 *
 * HomePage
 *
 */

import React from "react";
import pluginId from "../../pluginId";

import Home from "../../components/Home";

type HomePageProps = {
  routeComponentProps: any;
} & React.HTMLAttributes<HTMLDivElement>;

const HomePage = ({ routeComponentProps }: HomePageProps) => {
  return <Home />;
};

export default HomePage;
