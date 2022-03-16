import React from "react";
import { Outlet, useParams } from "react-router-dom";
import { NovelProvider } from "../providers/NovelProvider";

const NovelProviderLayout: React.FC = (props) => {
  const params = useParams();
  const id = parseInt(params.novelId || "0");
  return (
    <NovelProvider id={id}>
      <Outlet />
    </NovelProvider>
  );
};

export default NovelProviderLayout;
