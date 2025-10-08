import { Router } from 'express';
import { createReservation, getUserReservations, getAllReservations, updateReservationStatus } from '../controllers/reservationController';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Customer routes (require authentication)
router.post('/', requireAuth, createReservation);
router.get('/my-reservations', requireAuth, getUserReservations);

// Admin routes (require admin role)
router.get('/all', requireAuth, requireRole('ADMIN'), getAllReservations);
router.patch('/:id/status', requireAuth, requireRole('ADMIN'), updateReservationStatus);

export default router;
