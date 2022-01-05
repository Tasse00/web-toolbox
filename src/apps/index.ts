import { AppConfig } from "../framework/Framework";
import { JsonViewApp } from "./JsonView";
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
];

export default configs;
