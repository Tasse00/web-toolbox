import React, { useCallback, useState } from "react";
import { I18nContext } from "./I18nContext";

export interface I18nProviderProps {
  defaultLang?: string;
  initialLocales?: Record<string, Record<string, string>>;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({
  defaultLang = "en-US",
  initialLocales = {},
  ...props
}) => {
  const [locales, setLocales] =
    useState<Record<string, Record<string, string>>>(initialLocales);
  const [globalLang, setGlobalLang] = useState(defaultLang);

  const provide = useCallback((lang, translations) => {
    setLocales((l) => {
      if (l[lang] === undefined) {
        l[lang] = { ...translations };
      } else {
        l[lang] = { ...l[lang], ...translations };
      }
      return { ...l };
    });
  }, []);
  return (
    <I18nContext.Provider
      value={{ locales, globalLang, change: setGlobalLang, provide }}
    >
      {props.children}
    </I18nContext.Provider>
  );
};
