type TaskType = (() => Promise<any>) | (() => any);
export class AsyncTaskQueueExecutor {
  private tasks: TaskType[] = [];
  private isRunning = false;

  unshift(tsk: TaskType) {
    this.tasks.unshift(tsk);
    this.keepRuning();
  }

  append(tsk: TaskType) {
    this.tasks.push(tsk);
    this.keepRuning();
  }

  remove(tsk: TaskType) {
    this.keepRuning();
    const idx = this.tasks.findIndex((t) => t === tsk);
    if (idx > -1) {
      this.tasks.splice(idx, 1);
    }
  }

  private async forceAsync(ms: number = 0) {
    await new Promise((res) => setTimeout(res, ms));
  }

  private keepRuning() {
    if (this.isRunning) return;

    if (this.tasks.length === 0) return;

    this.isRunning = true;
    const task = this.tasks.shift();
    if (task) {
      setTimeout(async () => {
        if (!task.toString().startsWith("async")) {
          await this.forceAsync();
        }
        await task();
        this.isRunning = false;
        this.keepRuning();
      }, 0);
    }
  }
}
