import { SyncStatus } from "./providers/ServiceProvider";

export const SyncStatusMap = {
  [SyncStatus.Created]: "Syncing",
  [SyncStatus.Syncing]: "Syncing",
  [SyncStatus.Failed]: "Failed",
  [SyncStatus.Finished]: "Finished",
};
