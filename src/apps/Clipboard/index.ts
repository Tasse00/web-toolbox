import { AppConfig } from "../../framework/Framework";
import Clipboard from "./Clipboard";

// ClipboardApp

export const ClipbardAppConfig: AppConfig = {
  appId: "clipboard",
  component: Clipboard,
  title: "Clipboard",
  defaultProps: {},
  suggestSize: [800, 600],
};
