import { Router } from 'express';
import { getMenu, createMenuItem, updateMenuItem, deleteMenuItem, getCategories, createCategory } from '../controllers/menuController';
import { validateMenuItem, validateCategory } from '../middlewares/menuValidation';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getMenu);
router.post('/item', requireAuth, requireRole('ADMIN'), validateMenuItem, createMenuItem);
router.put('/item/:id', requireAuth, requireRole('ADMIN'), validateMenuItem, updateMenuItem);
router.delete('/item/:id', requireAuth, requireRole('ADMIN'), deleteMenuItem);

router.get('/categories', getCategories);
router.post('/category', requireAuth, requireRole('ADMIN'), validateCategory, createCategory);

export default router;