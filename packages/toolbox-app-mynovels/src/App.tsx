import React, { useEffect, useState } from "react";
import { MemoryRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "toolbox-components";
import { usePages } from "./hooks";
import BookShelfPage from "./pages/BookShelfPage";
import LibraryPage from "./pages/LibraryPage";
import UnionSearchPage from "./pages/UnionSearchPage";
import { ServiceProvider } from "./providers/ServiceProvider";
import { ChakraProvider } from "@chakra-ui/react";
import RouterTabs from "./components/RouterTabs";
import SettingsPage from "./pages/SettingsPage";
import NovelPage from "./pages/NovelPage";
import ChapterPage from "./pages/ChapterPage";
import { I18nProvider, useAppConfig, useI18n } from "toolbox-framework";
import { locales } from "./locales";
interface AppProps {}

const App: React.FC<AppProps> = () => {
  const pages = usePages();
  const [t] = useI18n();

  return (
    <Layout style={{ height: "100%" }}>
      <MemoryRouter>
        <Routes>
          <Route
            path="tabs"
            element={
              <RouterTabs
                tabs={[
                  {
                    path: pages.TabBookshelf.path,
                    text: t("app.mynovels.tab.recent"),
                  },
                  {
                    path: pages.TabLibrary.path,
                    text: t("app.mynovels.tab.library"),
                  },
                  {
                    path: pages.TabUnionSearch.path,
                    text: t("app.mynovels.tab.union"),
                  },
                  {
                    path: pages.TabSettings.path,
                    text: t("app.mynovels.tab.settings"),
                  },
                ]}
              />
            }
          >
            <Route
              path={pages.TabBookshelf.tailPath}
              element={<BookShelfPage />}
            />
            <Route path={pages.TabLibrary.tailPath} element={<LibraryPage />} />
            <Route
              path={pages.TabUnionSearch.tailPath}
              element={<UnionSearchPage />}
            />
            <Route
              path={pages.TabSettings.tailPath}
              element={<SettingsPage />}
            />
          </Route>

          <Route path={pages.Novel.path} element={<NovelPage />} />
          <Route path={pages.Chapter.path} element={<ChapterPage />} />

          <Route path="*" element={<Navigate to={pages.TabBookshelf.path} />} />
        </Routes>
      </MemoryRouter>
    </Layout>
  );
};

const AppWithProviders: React.FC<AppProps> = (props) => {
  const { value } = useAppConfig("server.lang", "en-US");
  const [lang, setLang] = useState("");
  useEffect(() => {
    if (value && !lang) {
      setLang(value);
    }
  }, [lang, value]);

  return (
    <ChakraProvider>
      {lang && (
        <I18nProvider initialLocales={locales} defaultLang={lang}>
          <ServiceProvider>
            <App {...props} />
          </ServiceProvider>
        </I18nProvider>
      )}
    </ChakraProvider>
  );
};

export default AppWithProviders;
