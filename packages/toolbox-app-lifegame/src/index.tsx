import React from "react";

import { AppConfig } from "toolbox-framework";
import LifeGame from "./App";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
const App: React.FC<any> = (props) => (
  <DndProvider backend={HTML5Backend}>
    <LifeGame {...props} />
  </DndProvider>
);

export const LifeGameConfig: AppConfig = {
  appId: "lifegame",
  title: "LifeGame",
  component: App,
  defaultProps: {},
};
