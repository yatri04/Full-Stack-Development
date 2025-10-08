import type { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

export const createReview = async (req: AuthRequest, res: Response) => {
  const { orderId, rating, comment } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Clean the orderId - remove "Order #" prefix if present
    const cleanOrderId = orderId.replace(/^Order\s*#?/, '').trim();
    
    // Validate ObjectID format (24 hex characters)
    if (!/^[0-9a-fA-F]{24}$/.test(cleanOrderId)) {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }
    
    // Check if the order exists and belongs to the user
    const order = await prisma.order.findFirst({
      where: {
        id: cleanOrderId,
        userId: userId,
        status: 'COMPLETED'
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found or not completed' });
    }

    // Check if review already exists for this order
    const existingReview = await prisma.review.findUnique({
      where: { orderId: cleanOrderId }
    });

    if (existingReview) {
      return res.status(400).json({ error: 'Review already exists for this order' });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        orderId: cleanOrderId,
        userId,
        rating,
        comment,
        status: 'PENDING'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        order: {
          include: {
            orderItems: {
              include: {
                menuItem: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: 'Review submitted successfully and is pending approval',
      review
    });
  } catch (error) {
    console.error('Review creation error:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

export const getApprovedReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        status: 'APPROVED'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
        order: {
          include: {
            orderItems: {
              include: {
                menuItem: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ reviews });
  } catch (error) {
    console.error('Error fetching approved reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

export const getAllReviews = async (req: AuthRequest, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        order: {
          include: {
            orderItems: {
              include: {
                menuItem: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ reviews });
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

export const updateReviewStatus = async (req: AuthRequest, res: Response) => {
  const { reviewId } = req.params;
  const { status } = req.body;

  if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be PENDING, APPROVED, or REJECTED' });
  }

  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: { 
        status,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        order: {
          include: {
            orderItems: {
              include: {
                menuItem: true
              }
            }
          }
        }
      }
    });

    res.json({
      message: `Review ${status.toLowerCase()} successfully`,
      review: updatedReview
    });
  } catch (error) {
    console.error('Error updating review status:', error);
    res.status(500).json({ error: 'Failed to update review status' });
  }
};

export const getUserReviews = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        order: {
          include: {
            orderItems: {
              include: {
                menuItem: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ reviews });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ error: 'Failed to fetch user reviews' });
  }
};

export const getReviewStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalReviews = await prisma.review.count();
    const pendingReviews = await prisma.review.count({
      where: { status: 'PENDING' }
    });
    const approvedReviews = await prisma.review.count({
      where: { status: 'APPROVED' }
    });
    const rejectedReviews = await prisma.review.count({
      where: { status: 'REJECTED' }
    });

    // Calculate average rating from approved reviews
    const approvedReviewsData = await prisma.review.findMany({
      where: { status: 'APPROVED' },
      select: { rating: true }
    });

    const averageRating = approvedReviewsData.length > 0 
      ? approvedReviewsData.reduce((sum, review) => sum + review.rating, 0) / approvedReviewsData.length
      : 0;

    res.json({
      totalReviews,
      pendingReviews,
      approvedReviews,
      rejectedReviews,
      averageRating: Math.round(averageRating * 10) / 10
    });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({ error: 'Failed to fetch review statistics' });
  }
};
