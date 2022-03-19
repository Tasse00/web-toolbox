import React, { useCallback, useContext, useMemo } from "react";
import { useAppConfig } from "toolbox-framework";

export interface ChapterMeta {
  id: number;
  title: string;
  url: string;
  synced: boolean;
}
export interface ChapterInfo extends ChapterMeta {
  lines: string[];
  sync_at: string;
}

export interface ChapterDetails extends ChapterInfo {
  next_id: number | null;
  prev_id: number | null;
}

export interface NovelMeta {
  id: number;
  source: string;
  url: string;
  title: string;
  author: string;
}

export interface NovelInfo extends NovelMeta {
  img: string;
  desc: string;
  sync_status: SyncStatusEnum;
  sync_total_chapters: number;
  sync_finished_chapters: number;
  sync_manual_stopped: boolean;
}

export interface NovelDetails extends NovelInfo {
  chapters: ChapterMeta[];
}

export interface ExternalSiteNovel {
  source: string;
  title: string;
  author: string;
  url: string;

  local: NovelInfo | null;
}

export enum SyncStatusEnum {
  Created = 1,
  Syncing = 2,
  Finished = 3,
  Failed = 4,
}

export interface ServiceProviderValue {
  searchUnion: (keyword: string) => Promise<ExternalSiteNovel[]>;
  searchSync: (keyword: string) => Promise<NovelInfo[]>;
  startSyncNovel: (source: string, url: string) => Promise<NovelDetails>;
  fetchSyncNovel: (id: number) => Promise<NovelDetails>;
  fetchSyncChapter: (id: number) => Promise<ChapterDetails>;

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
      const resp = await fetch(u("/search/external_sites", { keyword }));
      if (resp.status !== 200) {
        throw {
          status: resp.status,
          data: await resp.json(),
        };
      } else {
        const result = await resp.json();
        return result as ExternalSiteNovel[];
      }
    },
    [serverUrl]
  );

  const searchSync = useCallback(
    async (keyword: string) => {
      const resp = await fetch(u("/search/library", { keyword }));
      if (resp.status !== 200) {
        throw {
          status: resp.status,
          data: await resp.json(),
        };
      } else {
        const result = await resp.json();
        return result as NovelInfo[];
      }
    },
    [serverUrl]
  );

  const fetchSyncNovel = useCallback(
    async (id: number) => {
      const resp = await fetch(u(`/novels/${id}`));
      if (resp.status !== 200) {
        throw {
          status: resp.status,
          data: await resp.json(),
        };
      } else {
        const result = await resp.json();
        return result as NovelDetails;
      }
    },
    [serverUrl]
  );

  const fetchSyncChapter = useCallback(
    async (id: number) => {
      const resp = await fetch(u(`/chapters/${id}`));
      if (resp.status !== 200) {
        throw {
          status: resp.status,
          data: await resp.json(),
        };
      } else {
        const result = await resp.json();
        return result as ChapterDetails;
      }
    },
    [serverUrl]
  );

  const startSyncNovel = useCallback(
    async (source: string, url: string) => {
      const resp = await fetch(u(`/sync/novel`), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ source, url }),
      });
      if (resp.status !== 200) {
        throw {
          status: resp.status,
          data: await resp.json(),
        };
      } else {
        const result = await resp.json();
        return result as NovelDetails;
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
