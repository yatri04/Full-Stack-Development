import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

const menuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  image: z.string().url().optional().or(z.literal('')),
  available: z.boolean().optional(),
  categoryId: z.string().min(1)
});

const categorySchema = z.object({
  name: z.string().min(1)
});

export function validateMenuItem(req: Request, res: Response, next: NextFunction) {
  const result = menuItemSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }
  next();
}

export function validateCategory(req: Request, res: Response, next: NextFunction) {
  const result = categorySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }
  next();
}