import { Queue, Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';
import { prisma } from '../config/prisma';

// 1. Queue Definitions
export const exportQueue = new Queue('exportQueue', { connection: redisConnection });
export const aiQueue = new Queue('aiQueue', { connection: redisConnection });

// 2. Export Worker Logic
const exportWorker = new Worker(
  'exportQueue',
  async (job: Job) => {
    const { jobId } = job.data;
    
    // Simulating the heavy React/Tailwind/PDF compile process that we mocked in the service earlier
    await prisma.exportJob.update({ where: { id: jobId }, data: { status: 'PROCESSING', progress: 10 } });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await prisma.exportJob.update({ where: { id: jobId }, data: { progress: 50 } });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await prisma.exportJob.update({ where: { id: jobId }, data: { progress: 90 } });
    await new Promise(resolve => setTimeout(resolve, 500));

    const exportRec = await prisma.exportJob.findUnique({ where: { id: jobId } });
    const format = exportRec?.format.toLowerCase() || 'zip';
    const mockSignedUrl = `https://storage.designflow.ai/exports/${exportRec?.projectId}/${format}_${Date.now()}.${format}?sig=bullmq123`;

    await prisma.exportJob.update({
      where: { id: jobId },
      data: { status: 'COMPLETED', progress: 100, fileUrl: mockSignedUrl }
    });
  },
  { connection: redisConnection }
);

// 3. AI Worker Logic (for background generations proxying to Python FastAPI)
const aiWorker = new Worker(
  'aiQueue',
  async (job: Job) => {
    const { generationId, conversationId, type, prompt, context } = job.data;
    
    await prisma.aIGeneration.update({ where: { id: generationId }, data: { status: 'PROCESSING', progress: 10 } });
    
    // Determine FastAPI endpoint based on type
    let endpoint = 'http://localhost:8000/api/v1/generate/';
    if (type === 'PRODUCT_BRIEF') endpoint += 'product';
    else if (type === 'SCREEN') endpoint += 'screen';
    else endpoint += 'product'; // fallback

    try {
      await prisma.aIGeneration.update({ where: { id: generationId }, data: { progress: 50 } });
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: conversationId, prompt, context })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Python AI Service Error');
      }

      const responseData = await response.json();
      
      await prisma.aIGeneration.update({ 
        where: { id: generationId }, 
        data: { 
          status: 'COMPLETED', 
          progress: 100,
          payload: JSON.stringify(responseData.data) 
        } 
      });

    } catch (error: any) {
      await prisma.aIGeneration.update({ 
        where: { id: generationId }, 
        data: { status: 'FAILED', error: error.message } 
      });
    }
  },
  { connection: redisConnection }
);

exportWorker.on('completed', (job) => console.log(`Export job ${job.id} completed.`));
exportWorker.on('failed', (job, err) => console.log(`Export job ${job?.id} failed with ${err.message}`));

console.log('Background Workers Initialized.');
