import { useMemo } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";

export const Pages = {
  BookShelf: "/",
  SearchSyncNovels: "/search/sync-novels",
  SearchUnionNovels: "/search/union-novels",
  Reader: "/reader",
};

export function usePages() {
  const go = useNavigate();
  return useMemo(
    () => ({
      goBookShelf() {
        go({ pathname: Pages.BookShelf });
      },
      goSearchSync({ keyword }: { keyword: string }) {
        go({
          pathname: Pages.SearchSyncNovels,
          search: createSearchParams({ keyword }).toString(),
        });
      },
      goSearchUnion({ keyword }: { keyword: string }) {
        go({
          pathname: Pages.SearchUnionNovels,
          search: createSearchParams({ keyword }).toString(),
        });
      },
      goReader({ id }: { id: number }) {
        go({
          pathname: Pages.Reader,
          search: createSearchParams({ id: id.toString() }).toString(),
        });
      },
      goBack() {
        go(-1);
      },
    }),
    [go]
  );
}
