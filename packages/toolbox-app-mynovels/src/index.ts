import { AppConfig } from "toolbox-framework";
import App from "./App";
// 考虑PC及移动端体验

// 1. 首先设置服务地址
// 2. Route: 搜索页
// 3. Route: 目录页
// 4. Route: 章节页

export const MyNovelsAppConfig: AppConfig = {
  appId: "mynovels",
  title: "MyNovels",
  component: App,
  defaultProps: {},
  suggestSize: [375, 662],
};
