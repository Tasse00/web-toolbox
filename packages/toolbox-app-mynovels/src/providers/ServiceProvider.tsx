import React, { useCallback, useContext, useMemo } from "react";
import { useAppConfig } from "toolbox-framework";

export interface NovelCandidate {
  source: string;
  url: string;

  title: string;
  author: string;
  img_url: string;
}

export enum SyncStatus {
  Created = 1,
  Syncing = 2,
  Finished = 3,
  Failed = 4,
}
export interface SyncNovelRecord {
  id: number;
  source: string;
  url: string;
  status: SyncStatus;
  progress: number;
  message: string;
}
export interface SyncNovel {
  id: number;
  source: string;
  url: string;

  title: string;
  author: string;
  img_url: string;

  sync: SyncNovelRecord;

  chapters_meta: {
    id: number | null;
    sync: boolean;
    title: string;
    href: string;
  }[];
}

export interface SyncChapter {
  id: number;
  title: string;
  href: string;
  raw: string;
  lines: string[];
}

export interface ServiceProviderValue {
  searchUnion: (keyword: string) => Promise<NovelCandidate[]>;
  searchSync: (keyword: string) => Promise<SyncNovel[]>;
  startSyncNovel: (source: string, url: string) => Promise<SyncNovelRecord>;
  fetchSyncNovel: (id: number) => Promise<SyncNovel>;
  fetchSyncChapter: (id: number) => Promise<SyncChapter>;

  setServerUrl: (url: string) => Promise<void>;
}

const defaultFunc = () => {
  throw new Error("not in ServiceProvider");
};

const Context = React.createContext<ServiceProviderValue>({
  searchUnion: defaultFunc,
  searchSync: defaultFunc,
  startSyncNovel: defaultFunc,
  fetchSyncChapter: defaultFunc,
  fetchSyncNovel: defaultFunc,

  setServerUrl: defaultFunc,
});

export const ServiceProvider: React.FC<{}> = (props) => {
  const { value: serverUrl, update: _setServerUrl } = useAppConfig(
    "server.url",
    "http://127.0.0.1:8000/"
  );

  function u(url: string, args: Record<string, string> = {}): string {
    console.log(args);
    let _url = serverUrl;
    if (_url.endsWith("/")) {
      _url = _url.slice(0, serverUrl.length - 1);
    }
    _url += url;
    if (Object.keys(args).length > 0) {
      _url +=
        "?" +
        Object.entries(args)
          .map(([k, v]) => `${k}=${v}`)
          .join("&");
    }
    return _url;
  }

  const searchUnion = useCallback(
    async (keyword: string) => {
      const resp = await fetch(u("/search", { keyword }));
      if (resp.status !== 200) {
        throw {
          status: resp.status,
          data: await resp.json(),
        };
      } else {
        const result = await resp.json();
        return result as NovelCandidate[];
      }
    },
    [serverUrl]
  );

  const searchSync = useCallback(
    async (keyword: string) => {
      const resp = await fetch(u("/sync-novels/search", { keyword }));
      if (resp.status !== 200) {
        throw {
          status: resp.status,
          data: await resp.json(),
        };
      } else {
        const result = await resp.json();
        return result as SyncNovel[];
      }
    },
    [serverUrl]
  );

  const fetchSyncNovel = useCallback(
    async (id: number) => {
      const resp = await fetch(u(`/sync-novels/${id}`));
      if (resp.status !== 200) {
        throw {
          status: resp.status,
          data: await resp.json(),
        };
      } else {
        const result = await resp.json();
        return result as SyncNovel;
      }
    },
    [serverUrl]
  );

  const fetchSyncChapter = useCallback(
    async (id: number) => {
      const resp = await fetch(u(`/sync-chapters/${id}`));
      if (resp.status !== 200) {
        throw {
          status: resp.status,
          data: await resp.json(),
        };
      } else {
        const result = await resp.json();
        return result as SyncChapter;
      }
    },
    [serverUrl]
  );

  const startSyncNovel = useCallback(
    async (source: string, url: string) => {
      const resp = await fetch(u(`/sync-novel`), {
        method: "POST",
        body: JSON.stringify({ source, url }),
      });
      if (resp.status !== 201) {
        throw {
          status: resp.status,
          data: await resp.json(),
        };
      } else {
        const result = await resp.json();
        return result as SyncNovelRecord;
      }
    },
    [serverUrl]
  );

  const setServerUrl = useCallback(async (url) => {
    _setServerUrl(url);
  }, []);

  const value = useMemo(
    () => ({
      setServerUrl,
      searchSync,
      searchUnion,
      fetchSyncNovel,
      fetchSyncChapter,
      startSyncNovel,
    }),
    [
      setServerUrl,
      searchUnion,
      searchSync,
      fetchSyncNovel,
      fetchSyncChapter,
      startSyncNovel,
    ]
  );

  return <Context.Provider value={value}> {props.children} </Context.Provider>;
};

export function useServices() {
  return useContext(Context);
}
