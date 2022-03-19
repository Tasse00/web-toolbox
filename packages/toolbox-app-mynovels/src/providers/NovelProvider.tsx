import useRequest from "@ahooksjs/use-request";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { ChapterInfo, NovelDetails, useServices } from "./ServiceProvider";

const Context = React.createContext<{
  info: {
    loading: boolean;
    data?: NovelDetails;
    error?: Error;
  };

  chapter: {
    loading: boolean;
    data?: ChapterInfo;
    error?: Error;
  };

  read: (id: number) => any;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => any;
  onNext: () => any;
}>({
  info: { loading: false },
  chapter: { loading: false },
  hasNext: false,
  hasPrev: false,
  onPrev: () => {},
  onNext: () => {},
  read: () => {},
});

export const NovelProvider: React.FC<{ id: number }> = ({ id }) => {
  const { fetchSyncChapter, fetchSyncNovel } = useServices();
  const {
    data: infoData,
    loading: infoLoading,
    error: infoError,
  } = useRequest(async () => fetchSyncNovel(id), {
    refreshDeps: [id, fetchSyncNovel],
  });
  const [chapterId, setChapterId] = useState(-1);

  const {
    data: chapterData,
    loading: chapterLoading,
    error: chapterError,
    reset: chapterReset,
  } = useRequest(
    async () => {
      if (chapterId !== -1) {
        return fetchSyncChapter(chapterId);
      }
    },
    {
      refreshDeps: [chapterId, fetchSyncChapter],
    }
  );

  useEffect(() => {
    setChapterId(-1);
    chapterReset();
  }, [id, chapterReset]);

  const { hasPrev, hasNext, onPrev, onNext } = useMemo(() => {
    if (infoData) {
      const syncedChapterIds = infoData.chapters
        .map((ch) => (ch.id === null ? -1 : ch.id))
        .filter((id) => id !== -1);
      const idx = syncedChapterIds.indexOf(chapterId);
      const prevIdx = idx - 1;
      const nextIdx = idx + 1;
      const hasPrev = prevIdx >= 0 && prevIdx < syncedChapterIds.length;
      const hasNext = nextIdx >= 0 && nextIdx < syncedChapterIds.length;
      return {
        hasNext,
        hasPrev,
        onNext: () => {
          if (hasNext) setChapterId(syncedChapterIds[nextIdx]);
        },
        onPrev: () => {
          if (hasPrev) setChapterId(syncedChapterIds[prevIdx]);
        },
      };
    } else {
      return {
        hasPrev: false,
        hasNext: false,
        onPrev: () => {},
        onNext: () => {},
      };
    }
  }, [infoData, chapterId]);
  return (
    <Context.Provider
      value={{
        info: { loading: infoLoading, data: infoData, error: infoError },
        chapter: {
          loading: chapterLoading,
          data: chapterData,
          error: chapterError,
        },

        hasNext,
        hasPrev,
        onNext,
        onPrev,
        read: setChapterId,
      }}
    >
      <Outlet />
    </Context.Provider>
  );
};

export function useNovel() {
  return useContext(Context);
}
