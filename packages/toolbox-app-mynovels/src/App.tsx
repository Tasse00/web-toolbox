import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BookShelfPage from "./pages/BookShelfPage";
import SyncSearchPage from "./pages/SyncSearchPage";
import UnionSearchPage from "./pages/UnionSearchPage";
import { ServiceProvider } from "./providers/ServiceProvider";

interface AppProps {}

const App: React.FC<AppProps> = () => {
  return (
    <ServiceProvider>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<BookShelfPage />} />
          <Route path="/search/sync-novels" element={<SyncSearchPage />} />
          <Route path="/search/union-novels" element={<UnionSearchPage />} />
        </Routes>
      </MemoryRouter>
    </ServiceProvider>
  );
};
export default App;
