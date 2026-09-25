import { exportQueue } from '../queue';

export const exportService = {
  async processExportJob(jobId: string) {
    // Push the heavy job to the BullMQ Redis queue
    await exportQueue.add('generateExport', { jobId });
  }
};
