import { AppConfig } from "toolbox-framework";

import { Game2048AppConfig } from "toolbox-app-game2048";
import { JsonViewAppConfig } from "toolbox-app-jsonview";
import { SettingsAppConfig } from "toolbox-app-settings";
import { LifeGameConfig } from "toolbox-app-lifegame";
import { Web3UtilsAppConfig } from "toolbox-app-web3utils";
import { ClipbardAppConfig } from "toolbox-app-clipboard";
import { WebsocketAppConfig } from "toolbox-app-websocket";

const configs: AppConfig<any>[] = [
  Web3UtilsAppConfig,
  JsonViewAppConfig,
  Game2048AppConfig,
  SettingsAppConfig,
  ClipbardAppConfig,
  LifeGameConfig,
  WebsocketAppConfig,
];

export default configs;
