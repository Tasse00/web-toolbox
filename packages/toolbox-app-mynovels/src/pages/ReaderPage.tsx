import useRequest from "@ahooksjs/use-request";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Skeleton } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "toolbox-components";
import { ChapterViewer } from "../components/ChapterViewer";
import { MenuViewer } from "../components/MenuViewer";
import { usePages } from "../hooks";
import { useServices } from "../providers/ServiceProvider";

// /read?novelId[&chapterId]
const ReaderPage: React.FC<{}> = (props) => {
  const [searchParams] = useSearchParams();
  const id = parseInt(searchParams.get("id") || "");
  const pages = usePages();
  const { fetchSyncChapter, fetchSyncNovel } = useServices();
  const {
    data: info,
    loading: infoLoading,
    error: infoError,
  } = useRequest(async () => fetchSyncNovel(id), {
    refreshDeps: [id, fetchSyncNovel],
  });
  const [inMenu, setInMenu] = useState(true);
  const [chapterId, setChapterId] = useState(-1);
  const {
    data: chapter,
    loading: chapterLoading,
    error: chapterError,
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
  }, [info]);

  const { hasPrev, hasNext, onPrev, onNext } = useMemo(() => {
    if (info) {
      const syncedChapterIds = info.chapters_meta
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
  }, [info, chapterId]);

  return (
    <Layout
      style={{ height: "100%" }}
      bar={
        <div style={{ padding: 8, paddingBottom: 0 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            type="text"
            onClick={pages.goBack}
          />
        </div>
      }
    >
      <Layout style={{ flex: 1 }}>
        {inMenu &&
          (info ? (
            <MenuViewer
              info={info}
              onChapter={(id) => {
                setInMenu(false);
                setChapterId(id);
              }}
            />
          ) : (
            <Skeleton />
          ))}
        {!inMenu &&
          (chapter ? (
            <ChapterViewer
              title={chapter.title}
              lines={chapter.lines}
              hasNext={hasNext}
              hasPrev={hasPrev}
              onNext={onNext}
              onPrev={onPrev}
              onMenu={() => setInMenu(true)}
            />
          ) : (
            <Skeleton />
          ))}
      </Layout>
    </Layout>
  );
};

export default ReaderPage;
