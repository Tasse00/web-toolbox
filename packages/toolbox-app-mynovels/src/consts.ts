import { SyncStatusEnum } from "./providers/ServiceProvider";

export const SyncStatusMap = {
  [SyncStatusEnum.Created]: "Syncing",
  [SyncStatusEnum.Syncing]: "Syncing",
  [SyncStatusEnum.Failed]: "Failed",
  [SyncStatusEnum.Finished]: "Finished",
};
