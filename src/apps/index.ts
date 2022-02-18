import { AppConfig } from "../framework/Framework";
import { ClipbardAppConfig } from "./Clipboard";
import Game2048App from "./Game2048";
import { JsonViewApp } from "./JsonView";
import SettingsApp from "./Settings";
import TestApp from "./TestApp";
import { Web3UtilsApp } from "./Web3Utils";

const configs: AppConfig<any>[] = [
  {
    appId: "web3-utils",
    title: "Web3Utils",
    component: Web3UtilsApp,
    defaultProps: {},
  },
  {
    appId: "json-viewer",
    title: "JsonViewer",
    component: JsonViewApp,
    defaultProps: {},
  },
  {
    appId: "test",
    title: "TEST",
    component: TestApp,
    defaultProps: {},
  },
  {
    appId: "game2048",
    title: "2048",
    component: Game2048App,
    defaultProps: {},
  },
  {
    appId: "settings",
    title: "Settings",
    component: SettingsApp,
    defaultProps: {},
  },
  ClipbardAppConfig,
];

export default configs;
