import { Router } from 'express';
import { 
  createReview, 
  getApprovedReviews, 
  getAllReviews, 
  updateReviewStatus, 
  getUserReviews,
  getReviewStats 
} from '../controllers/reviewController';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.get('/approved', getApprovedReviews);

// Customer routes (require authentication)
router.post('/', requireAuth, createReview);
router.get('/my-reviews', requireAuth, getUserReviews);

// Admin routes (require admin role)
router.get('/all', requireAuth, requireRole('ADMIN'), getAllReviews);
router.get('/stats', requireAuth, requireRole('ADMIN'), getReviewStats);
router.patch('/:reviewId/status', requireAuth, requireRole('ADMIN'), updateReviewStatus);

export default router;
