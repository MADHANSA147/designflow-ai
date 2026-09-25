import { Request, Response } from 'express';
import { healthService } from '../services/health.service';

export const getHealth = (req: Request, res: Response) => {
  const status = healthService.getHealthStatus();
  res.status(200).json(status);
};
