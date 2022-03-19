import {
  CheckCircleIcon,
  InfoIcon,
  SpinnerIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import { Center, Text, Tooltip } from "@chakra-ui/react";
import React from "react";
import { NovelInfo, SyncStatusEnum } from "../providers/ServiceProvider";
interface Props {
  novel: NovelInfo;
}

// 上一次同步完成
// 上一次同步失败
// 同步进行中 G&
export const SyncStatus: React.FC<Props> = ({
  novel: { sync_status, sync_finished_chapters, sync_total_chapters },
}) => {
  let progress = 0;
  if (sync_total_chapters > 0) {
    progress = Math.floor((sync_finished_chapters / sync_total_chapters) * 100);
  }
  const size = 4;
  switch (sync_status) {
    case SyncStatusEnum.Created:
      return (
        <Center>
          <Text mr={1}>Sync soon</Text>
        </Center>
      );
    case SyncStatusEnum.Failed:
      return (
        <Center>
          <Center>
            <Text mr={1}>Last Sync</Text>
            <WarningIcon boxSize={size} color="red.500" />
          </Center>
        </Center>
      );
    case SyncStatusEnum.Finished:
      return (
        <Center>
          <Text mr={1}>Sync</Text>
          <CheckCircleIcon boxSize={size} color="green.500" />
        </Center>
      );
    case SyncStatusEnum.Syncing:
      return (
        <Center>
          <Text mr={1}>{progress}%</Text>
          <SpinnerIcon boxSize={size} color="green.200" />
        </Center>
      );
    default:
      return (
        <Center>
          <Text>Unkown Sync Status</Text>
        </Center>
      );
  }
};
