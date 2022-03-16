import { Typography } from "antd";
import React from "react";
import {
  SyncNovelRecord,
  SyncStatus as SyncStatysType,
} from "../providers/ServiceProvider";

interface Props {
  sync: SyncNovelRecord;
}

export const SyncStatus: React.FC<Props> = ({ sync: { status, progress } }) => {
  switch (status) {
    case SyncStatysType.Created:
      return <Typography.Text>Will Sync Soon</Typography.Text>;
    case SyncStatysType.Failed:
      return <Typography.Text>Sync Failed</Typography.Text>;
    case SyncStatysType.Finished:
      return <Typography.Text>Sync Finished</Typography.Text>;
    case SyncStatysType.Syncing:
      return <Typography.Text>Syncing {progress}%</Typography.Text>;
    default:
      return <Typography.Text>Unkown Sync Status</Typography.Text>;
  }
};
