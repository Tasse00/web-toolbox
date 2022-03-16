import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Layout } from "toolbox-components";
import { Pages } from "./hooks";
import BookShelfPage from "./pages/BookShelfPage";
import ReaderPage from "./pages/ReaderPage";
import SyncSearchPage from "./pages/SyncSearchPage";
import UnionSearchPage from "./pages/UnionSearchPage";
import { ServiceProvider } from "./providers/ServiceProvider";

interface AppProps {}

const App: React.FC<AppProps> = () => {
  return (
    <Layout style={{ height: "100%" }}>
      <ServiceProvider>
        <MemoryRouter>
          <Routes>
            <Route path={Pages.BookShelf} element={<BookShelfPage />} />
            <Route path={Pages.SearchSyncNovels} element={<SyncSearchPage />} />
            <Route
              path={Pages.SearchUnionNovels}
              element={<UnionSearchPage />}
            />
            <Route path={Pages.Reader} element={<ReaderPage />} />
          </Routes>
        </MemoryRouter>
      </ServiceProvider>
    </Layout>
  );
};
export default App;
