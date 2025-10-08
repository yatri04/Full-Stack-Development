import type { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';
import { sendReservationNotification } from '../services/emailService';

const prisma = new PrismaClient();

export const createReservation = async (req: AuthRequest, res: Response) => {
  const { table, time } = req.body;
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

    // Create the reservation
    const reservation = await prisma.reservation.create({
      data: {
        userId,
        table: parseInt(table),
        time: new Date(time),
        status: 'PENDING'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Reservation created successfully',
      reservation
    });
  } catch (error) {
    console.error('Reservation creation error:', error);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
};

export const getUserReservations = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const reservations = await prisma.reservation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({ reservations });
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
};

export const getAllReservations = async (req: AuthRequest, res: Response) => {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({ reservations });
  } catch (error) {
    console.error('Get all reservations error:', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
};

export const updateReservationStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // First get the current reservation to check if status is changing
    const currentReservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!currentReservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Update the reservation status
    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Send email notification if status changed and it's a notification-worthy status
    const shouldNotify = ['APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED'].includes(status);
    const statusChanged = currentReservation.status !== status;
    
    if (shouldNotify && statusChanged) {
      try {
        await sendReservationNotification({
          customerName: reservation.user.name,
          customerEmail: reservation.user.email,
          reservationId: reservation.id,
          table: reservation.table,
          time: reservation.time.toISOString(),
          status: status as 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED'
        });
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the request if email fails, just log it
      }
    }

    res.json({
      message: 'Reservation status updated successfully',
      reservation
    });
  } catch (error) {
    console.error('Update reservation error:', error);
    res.status(500).json({ error: 'Failed to update reservation' });
  }
};
