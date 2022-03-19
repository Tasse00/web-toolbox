import { useMemo } from "react";
import {
  createSearchParams,
  NavigateFunction,
  URLSearchParamsInit,
  useNavigate,
} from "react-router-dom";

export const Pages = {
  BookShelf: "/tabs/bookshelf",
  SearchSyncNovels: "/tabs/library",
  SearchUnionNovels: "/search/union",
  Reader: "/reader",
};

// 1. 获取URL
// 2. 具有代码提示
// 3. 构建URL
// 4. go

interface NavHelper<T, U> {
  path: string;
  tailPath: string;
  buildUrl: (query?: T, params?: U) => string;
  go: (n: NavigateFunction, p?: T, params?: U) => void;
}

function buildHelper<
  T extends URLSearchParamsInit | undefined = {},
  U extends Record<string, any> | undefined = {}
>(url: string): NavHelper<T, U> {
  const parts = url.split("/");

  const buildUrl = (query?: T, params?: U) => {
    let u = url;
    if (params) {
      for (const [key, val] of Object.entries(params)) {
        u = u.replace(`:${key}`, val);
      }
    }
    if (query) {
      u = u + "?" + createSearchParams(query).toString();
    }
    console.log(u);
    return u;
  };
  return {
    path: url,
    tailPath: parts[parts.length - 1],
    buildUrl,
    go: (n, query?: T, params?: U) => n(buildUrl(query, params)),
  };
}

export function usePages() {
  const pages = useMemo(
    () => ({
      TabBookshelf: buildHelper("/tabs/bookshelf"),
      TabLibrary: buildHelper<{ search?: string }>("/tabs/library"),
      TabUnionSearch: buildHelper<{ search?: string }>("/tabs/unionsearch"),
      TabSettings: buildHelper("/tabs/settings"),
      Novel: buildHelper<{ id: string }>("/novel"),
      Chapter: buildHelper<{ id: string }>("/chapter"),
    }),
    []
  );

  return pages;
}
