import { z } from 'zod';

export const getAssetUrlSchema = z.object({
  query: z.object({
    assetId: z.string().uuid(),
    expiresIn: z.string().optional(), // Seconds
  })
});

export const deleteAssetSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  })
});
