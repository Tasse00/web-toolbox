import React from "react";
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
interface AppProps {}

const App: React.FC<AppProps> = () => {
  const pages = usePages();
  return (
    <ChakraProvider>
      <Layout style={{ height: "100%" }}>
        <ServiceProvider>
          <MemoryRouter>
            <Routes>
              <Route
                path="tabs"
                element={
                  <RouterTabs
                    tabs={[
                      {
                        path: pages.TabBookshelf.path,
                        text: "Recent",
                      },
                      {
                        path: pages.TabLibrary.path,
                        text: "Library",
                      },
                      {
                        path: pages.TabUnionSearch.path,
                        text: "Union",
                      },
                      {
                        path: pages.TabSettings.path,
                        text: "Settings",
                      },
                    ]}
                  />
                }
              >
                <Route
                  path={pages.TabBookshelf.tailPath}
                  element={<BookShelfPage />}
                />
                <Route
                  path={pages.TabLibrary.tailPath}
                  element={<LibraryPage />}
                />
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

              <Route
                path="*"
                element={<Navigate to={pages.TabBookshelf.path} />}
              />
            </Routes>
          </MemoryRouter>
        </ServiceProvider>
      </Layout>
    </ChakraProvider>
  );
};
export default App;
