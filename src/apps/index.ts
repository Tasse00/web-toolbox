import { AppConfig } from "../framework/Framework";
import { JsonViewApp } from "./JsonView";
import { Web3UtilsApp } from "./Web3Utils";

const configs: AppConfig[] = [
  {
    appId: "web3-utils",
    title: "Web3Utils",
    component: Web3UtilsApp,
  },
  {
    appId: "json-viewer",
    title: "JsonViewer",
    component: JsonViewApp,
  },
];

export default configs;
