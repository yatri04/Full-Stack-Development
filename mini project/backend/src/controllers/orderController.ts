import type { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

export const createOrder = async (req: AuthRequest, res: Response) => {
  const { items } = req.body; // items: [{ menuItemId, quantity }]
  const userId = req.user?.userId;

  console.log('Creating order for user:', userId, 'with items:', items);

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate menu items exist and are available
    const menuItemIds = items.map((item: any) => item.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
        available: true
      }
    });

    if (menuItems.length !== menuItemIds.length) {
      return res.status(400).json({ error: 'Some menu items are not available' });
    }

    // Create the order with order items
    const order = await prisma.order.create({
      data: {
        userId,
        status: 'PENDING',
        orderItems: {
          create: items.map((item: any) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity
          }))
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        orderItems: {
          include: {
            menuItem: true
          }
        }
      }
    });

    console.log('Order created successfully:', order.id);
    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: {
          include: {
            menuItem: true
          }
        }
      }
    });

    res.json({ orders });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        orderItems: {
          include: {
            menuItem: true
          }
        }
      }
    });

    res.json({ orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        orderItems: {
          include: {
            menuItem: true
          }
        }
      }
    });

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        orderItems: {
          include: {
            menuItem: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get this week's date range
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    // Get today's sales
    const todayOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        },
        status: 'COMPLETED'
      },
      include: {
        orderItems: {
          include: {
            menuItem: true
          }
        }
      }
    });

    const todaySales = todayOrders.reduce((total, order) => {
      return total + order.orderItems.reduce((orderTotal, item) => {
        return orderTotal + (item.menuItem.price * item.quantity);
      }, 0);
    }, 0);

    // Get weekly orders count
    const weeklyOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: startOfWeek,
          lt: endOfWeek
        }
      }
    });

    // Get total customers
    const totalCustomers = await prisma.user.count({
      where: {
        role: 'CUSTOMER'
      }
    });

    // Get this week's reservations
    const weeklyReservations = await prisma.reservation.count({
      where: {
        createdAt: {
          gte: startOfWeek,
          lt: endOfWeek
        }
      }
    });

    // Get best selling items
    const bestSellingItems = await prisma.orderItem.groupBy({
      by: ['menuItemId'],
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    });

    const bestSellingItemsWithDetails = await Promise.all(
      bestSellingItems.map(async (item) => {
        const menuItem = await prisma.menuItem.findUnique({
          where: { id: item.menuItemId }
        });
        return {
          name: menuItem?.name || 'Unknown',
          sales: item._sum.quantity || 0
        };
      })
    );

    // Get daily sales for the last 7 days
    const dailySales = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      const dayOrders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: date,
            lt: nextDate
          },
          status: 'COMPLETED'
        },
        include: {
          orderItems: {
            include: {
              menuItem: true
            }
          }
        }
      });

      const daySales = dayOrders.reduce((total, order) => {
        return total + order.orderItems.reduce((orderTotal, item) => {
          return orderTotal + (item.menuItem.price * item.quantity);
        }, 0);
      }, 0);

      dailySales.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        sales: daySales
      });
    }

    res.json({
      todaySales,
      weeklyOrders,
      totalCustomers,
      weeklyReservations,
      bestSellingItems: bestSellingItemsWithDetails,
      dailySales
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};