import { downloadPageAudios } from '../downloadAudios';

type Task = {
  pageId: number;
  onProgress?: (progress: number) => void;
  resolve: () => void;
  reject: (err: any) => void;
};

class DownloadManager {
  private concurrencyLimit = 2; // adjust this
  private activeCount = 0;
  private queue: Task[] = [];

  add(pageId: number, onProgress?: (progress: number) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      this.queue.push({ pageId, onProgress, resolve, reject });
      this.runNext();
    });
  }

  private async runNext() {
    if (this.activeCount >= this.concurrencyLimit) return;
    const task = this.queue.shift();
    if (!task) return;

    this.activeCount++;
    try {
      await downloadPageAudios(task.pageId, task.onProgress);
      task.resolve();
    } catch (err) {
      task.reject(err);
    } finally {
      this.activeCount--;
      this.runNext();
    }
  }
}

export const downloadManager = new DownloadManager();
