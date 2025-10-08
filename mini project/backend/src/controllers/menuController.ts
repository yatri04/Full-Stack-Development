import type { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export const getMenu = async (req: Request, res: Response) => {
  try {
    console.log('Fetching menu items...');
    const items = await prisma.menuItem.findMany({ include: { category: true } });
    console.log('Found', items.length, 'menu items');
    res.json(items);
  } catch (err) {
    console.error('Error fetching menu:', err);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
};

export const createMenuItem = async (req: Request, res: Response) => {
  const { name, description, price, image, available, categoryId } = req.body;
  console.log('Creating menu item:', { name, description, price, image, available, categoryId });
  try {
    const item = await prisma.menuItem.create({
      data: { name, description, price, image, available, categoryId }
    });
    console.log('Menu item created successfully:', item);
    res.status(201).json(item);
  } catch (err) {
    console.error('Error creating menu item:', err);
    res.status(500).json({ error: 'Failed to create menu item' });
  }
};

export const updateMenuItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, image, available, categoryId } = req.body;
  try {
    const item = await prisma.menuItem.update({
      where: { id },
      data: { name, description, price, image, available, categoryId }
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update menu item' });
  }
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.menuItem.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    console.log('Fetching categories...');
    const categories = await prisma.category.findMany();
    console.log('Found', categories.length, 'categories');
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const category = await prisma.category.create({ data: { name } });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};