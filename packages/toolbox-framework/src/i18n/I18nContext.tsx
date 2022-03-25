import React from "react";

export interface I18nContextValue {
  locales: Record<string, Record<string, string>>;
  globalLang: string;

  provide: (lang: string, translations: Record<string, string>) => void;
  change: (lang: string) => void;
}

export const I18nContext = React.createContext<I18nContextValue>({
  locales: {},
  globalLang: "",
  provide: () => {},
  change: () => {},
});
