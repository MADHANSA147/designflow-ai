import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middleware/auth.middleware';
import { storageService } from '../services/storage.service';
import { v4 as uuidv4 } from 'uuid';

export const uploadAsset = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId, type } = req.body;
    const file = req.file;
    const user = req.user;

    if (!file) return next(new AppError('No file uploaded', 400));
    if (!type) return next(new AppError('Asset type is required (e.g. IMAGE, AVATAR)', 400));
    if (!user) return next(new AppError('Unauthorized', 401));

    // Security check: NEVER trust client provided mimetype alone in production (use magic number validation like 'file-type' library)
    // For this prototype, our multer filter acts as the primary gate.

    // Validate ownership if projectId provided
    if (projectId) {
      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (!project) return next(new AppError('Project not found', 404));
      // In reality, check if user is in workspace that owns the project.
    }

    const fileExt = file.originalname.split('.').pop() || 'bin';
    const storageKey = `assets/${projectId || user.id}/${type.toLowerCase()}_${uuidv4()}.${fileExt}`;

    const { bucket, key } = await storageService.uploadFile(file.buffer, storageKey, file.mimetype);

    const asset = await prisma.asset.create({
      data: {
        projectId: projectId || null,
        userId: user.id,
        name: file.originalname,
        storageKey: key,
        bucket,
        type,
        mimeType: file.mimetype,
        sizeBytes: file.size,
      }
    });

    res.status(201).json({ status: 'success', data: { asset } });
  } catch (error) { next(error); }
};

export const getAssetUrl = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const expiresIn = parseInt(req.query.expiresIn as string) || 3600;

    const asset = await prisma.asset.findUnique({ where: { id } });
    if (!asset) return next(new AppError('Asset not found', 404));

    // Optional ownership validation here based on req.user

    const signedUrl = await storageService.getSignedDownloadUrl(asset.storageKey, expiresIn);

    res.status(200).json({ status: 'success', data: { url: signedUrl } });
  } catch (error) { next(error); }
};

export const deleteAsset = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const asset = await prisma.asset.findUnique({ where: { id } });
    if (!asset) return next(new AppError('Asset not found', 404));

    await storageService.deleteFile(asset.storageKey);
    await prisma.asset.delete({ where: { id } });

    res.status(204).send();
  } catch (error) { next(error); }
};
