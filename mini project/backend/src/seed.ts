import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@cafe.com' },
    update: {},
    create: {
      email: 'admin@cafe.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  });

  console.log('Admin user created:', adminUser.email);
  // Create categories
  const coffeeCategory = await prisma.category.upsert({
    where: { name: 'Coffee' },
    update: {},
    create: { name: 'Coffee' }
  });

  const foodCategory = await prisma.category.upsert({
    where: { name: 'Food' },
    update: {},
    create: { name: 'Food' }
  });

  const beveragesCategory = await prisma.category.upsert({
    where: { name: 'Beverages' },
    update: {},
    create: { name: 'Beverages' }
  });

  // Create menu items
  const menuItems = [
    {
      name: 'Espresso',
      description: 'Rich, bold shot of our signature blend',
      price: 207.5,
      categoryId: coffeeCategory.id,
      available: true
    },
    {
      name: 'Cappuccino',
      description: 'Espresso with steamed milk and foam, topped with latte art',
      price: 373.5,
      categoryId: coffeeCategory.id,
      available: true
    },
    {
      name: 'Latte',
      description: 'Smooth espresso with steamed milk and a touch of foam',
      price: 394.25,
      categoryId: coffeeCategory.id,
      available: true
    },
    {
      name: 'Cold Brew',
      description: 'Smooth, refreshing coffee brewed cold for 12 hours',
      price: 311.25,
      categoryId: coffeeCategory.id,
      available: true
    },
    {
      name: 'Croissant',
      description: 'Buttery, flaky pastry baked fresh daily',
      price: 269.75,
      categoryId: foodCategory.id,
      available: true
    },
    {
      name: 'Avocado Toast',
      description: 'Multigrain bread with smashed avocado, microgreens, and sea salt',
      price: 726.25,
      categoryId: foodCategory.id,
      available: true
    },
    {
      name: 'Blueberry Muffin',
      description: 'Moist muffin packed with fresh blueberries',
      price: 290.5,
      categoryId: foodCategory.id,
      available: true
    },
    {
      name: 'Fresh Orange Juice',
      description: 'Freshly squeezed orange juice, no pulp',
      price: 352.75,
      categoryId: beveragesCategory.id,
      available: true
    },
    {
      name: 'Herbal Tea',
      description: 'Selection of premium herbal teas',
      price: 249.0,
      categoryId: beveragesCategory.id,
      available: true
    }
  ];

  for (const item of menuItems) {
    // Check if item already exists
    const existingItem = await prisma.menuItem.findFirst({
      where: { name: item.name }
    });
    
    if (!existingItem) {
      await prisma.menuItem.create({
        data: item
      });
    }
  }

  // Create a test customer user
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: {
      email: 'customer@test.com',
      password: customerPassword,
      name: 'Test Customer',
      role: 'CUSTOMER'
    }
  });

  // Create a test order for the customer
  const testOrder = await prisma.order.create({
    data: {
      userId: customerUser.id,
      status: 'COMPLETED',
      orderItems: {
        create: [
          {
            menuItemId: (await prisma.menuItem.findFirst({ where: { name: 'Cappuccino' } }))!.id,
            quantity: 1
          },
          {
            menuItemId: (await prisma.menuItem.findFirst({ where: { name: 'Croissant' } }))!.id,
            quantity: 1
          }
        ]
      }
    }
  });

  // Create some sample reviews
  const sampleReviews = [
    {
      orderId: testOrder.id,
      userId: customerUser.id,
      rating: 5,
      comment: 'Absolutely amazing coffee and pastries! The atmosphere is perfect for working.',
      status: 'APPROVED' as const
    }
  ];

  for (const review of sampleReviews) {
    const existingReview = await prisma.review.findFirst({
      where: { orderId: review.orderId }
    });
    
    if (!existingReview) {
      await prisma.review.create({
        data: review
      });
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
