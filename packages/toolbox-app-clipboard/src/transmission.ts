// 数据包: 类型:0:8 包长度:L:32
// 控制包  类型:1:8 L:32

// 状态:
// 1. 连接中
// 2. 传输中
// 3. 可下载
// 4. 已下载
// 5. 异常

export enum DownloadTaskStatus {
  Connecting = 1,
  Transporting = 2,
  Downloadable = 3,
  Downloaded = 4,
  Error = 5,
}

interface Options {
  id: string;
  name: string;
  size: number;

  onFinish?: () => any;
  onProgress?: (got: number, total: number) => any;
  onStatusChange?: (status: DownloadTaskStatus) => any;
}

export class DownloadTask {
  // buffer = new Uint8Array();
  buffer: ArrayBuffer[] = [];

  private stored = false;

  private lastProgressAt = new Date().valueOf();
  constructor(
    private readonly dataChannel: RTCDataChannel,
    private readonly options: Options
  ) {
    dataChannel.onopen = () => {
      this.options.onStatusChange?.(this.status);
    };
    dataChannel.onerror = () => {
      this.options.onStatusChange?.(this.status);
    };
    dataChannel.onclose = () => {
      this.options.onStatusChange?.(this.status);
    };
    dataChannel.onmessage = (ev) => {
      this.buffer.push(ev.data);

      // 一秒报告一次
      const nowTs = new Date().valueOf();
      if (nowTs - this.lastProgressAt > 200) {
        this.options.onProgress?.(this.downloadedBytes, this.filesize);
        this.lastProgressAt = nowTs;
        console.log(
          `progress ${this.downloadedBytes} / ${this.filesize} bytes`
        );
      }

      // 接收完毕，关闭通道
      if (this.downloadedBytes === this.options.size) {
        this.options.onProgress?.(this.downloadedBytes, this.filesize);
        this.options.onStatusChange?.(this.status);
        dataChannel.close();
      }
    };
  }

  async abort() {
    this.options.onFinish = undefined;
    this.options.onProgress = undefined;
    this.options.onStatusChange = undefined;
  }

  public get status(): DownloadTaskStatus {
    if (this.stored) {
      return DownloadTaskStatus.Downloaded;
    }
    if (this.downloadedBytes === this.options.size) {
      return DownloadTaskStatus.Downloadable;
    }
    if (this.dataChannel.readyState === "connecting") {
      return DownloadTaskStatus.Connecting;
    }
    if (
      this.dataChannel.readyState === "closed" ||
      this.dataChannel.readyState === "closing"
    ) {
      return DownloadTaskStatus.Error;
    }
    return DownloadTaskStatus.Transporting;
  }

  public get percent(): number {
    return (this.downloadedBytes / this.filesize) * 100;
  }

  public get filename(): string {
    return this.options.name;
  }

  public get filesize(): number {
    return this.options.size;
  }

  public get downloadedBytes(): number {
    if (!this.stored) {
      return this.buffer.map((b) => b.byteLength).reduce((a, b) => a + b, 0);
    } else {
      return this.options.size;
    }
  }

  public store() {
    let url = window.URL.createObjectURL(
      new Blob(this.buffer, { type: "arraybuffer" })
    );
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.setAttribute("download", this.filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.stored = true;
    this.buffer = [];
    this.options.onStatusChange?.(this.status);
  }
}
