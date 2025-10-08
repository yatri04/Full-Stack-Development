import { Router } from 'express';
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus, getOrderById, getAnalytics } from '../controllers/orderController';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Customer routes (require authentication)
router.post('/', requireAuth, createOrder);
router.get('/my-orders', requireAuth, getUserOrders);
router.get('/:id', requireAuth, getOrderById);

// Admin routes (require admin role)
router.get('/admin/all', requireAuth, requireRole('ADMIN'), getAllOrders);
router.get('/admin/analytics', requireAuth, requireRole('ADMIN'), getAnalytics);
router.patch('/:id/status', requireAuth, requireRole('ADMIN'), updateOrderStatus);

export default router;
