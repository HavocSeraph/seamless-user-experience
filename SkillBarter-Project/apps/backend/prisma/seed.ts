import { PrismaClient, Role, SkillLevel } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('password123', 12)

  // 1 admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@skillbarter.dev' },
    update: {},
    create: {
      email: 'admin@skillbarter.dev',
      passwordHash,
      name: 'System Admin',
      role: Role.ADMIN,
      tokenBalance: 999999,
      isVerified: true
    }
  })

  // 2 regular users
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@test.com' },
    update: {},
    create: {
      email: 'user1@test.com',
      passwordHash,
      name: 'Alex Johnson',
      tokenBalance: 150,
      isVerified: true
    }
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@test.com' },
    update: {},
    create: {
      email: 'user2@test.com',
      passwordHash,
      name: 'Sarah Chen',
      tokenBalance: 150,
      isVerified: true
    }
  })

  // 5 skills
  const skills = [
    {
      title: 'React Fundamentals',
      description: 'Learn the basics of React 19',
      category: 'Web Development',
      level: SkillLevel.BEGINNER,
      priceCoins: 30,
      userId: user1.id
    },
    {
      title: 'Advanced NestJS',
      description: 'Master backend architecture',
      category: 'Backend',
      level: SkillLevel.EXPERT,
      priceCoins: 100,
      userId: user1.id
    },
    {
      title: 'UI Design with Tailwind',
      description: 'Create beautiful interfaces',
      category: 'Design',
      level: SkillLevel.INTERMEDIATE,
      priceCoins: 50,
      userId: user2.id
    },
    {
      title: 'PostgreSQL for Pros',
      description: 'Deep dive into database performance',
      category: 'Database',
      level: SkillLevel.EXPERT,
      priceCoins: 100,
      userId: user2.id
    },
    {
      title: 'TypeScript Essentials',
      description: 'Typed JavaScript for safer code',
      category: 'Web Development',
      level: SkillLevel.BEGINNER,
      priceCoins: 30,
      userId: user1.id
    }
  ]

  for (const skill of skills) {
    await prisma.skill.create({ data: skill })
  }

  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
