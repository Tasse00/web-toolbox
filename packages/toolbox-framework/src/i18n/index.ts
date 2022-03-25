import { useCallback, useContext, useMemo } from "react";
import { Logger } from "toolbox-utils";
import { I18nContext } from "./I18nContext";
export { I18nProvider } from "./I18nProvider";

const logger = new Logger({ name: "i18n" });

type Translate = (t: string, args?: Record<string, string>) => string;

interface I18n {
  change: (lang: string) => void;
  provide: (lang: string, translations: Record<string, string>) => void;
  langs: () => string[];
  lang: string;
}

interface UseI18nOptions {
  fixedLang?: string; // 指定特定语言
}
export function useI18n({ fixedLang }: UseI18nOptions = {}): [Translate, I18n] {
  const { locales, globalLang, change, provide } = useContext(I18nContext);

  const lang = fixedLang || globalLang;

  const langTranslations = locales[lang];

  const t = useCallback(
    (t: string, args?: Record<string, string>) => {
      let trans = langTranslations[t];
      if (trans) {
        if (args) {
          for (const [key, val] of Object.entries(args)) {
            trans = trans.replace(`{${key}}`, val);
          }
        }
        return trans;
      } else {
        logger.warn(`lang=${lang} translate=${t}`);
        return t;
      }
    },
    [lang, langTranslations]
  );

  const val: I18n = useMemo(
    () => ({
      change,
      provide,
      langs: () => {
        const langs = Object.keys(locales).sort();
        if (!langs.includes(lang)) {
          langs.push(lang);
        }
        return langs;
      },
      lang,
    }),
    [change, provide, locales, lang]
  );

  return [t, val];
}
