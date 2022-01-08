import { AppConfig } from "../framework/Framework";
import { JsonViewApp } from "./JsonView";
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
];

export default configs;
