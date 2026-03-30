export const mockUser = {
  id: "u1",
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  tokenBalance: 230,
  reputationScore: 4.7,
  teachingStreak: 12,
  isVerified: true,
  githubId: "alexj",
  linkedinId: "alexjohnson",
  role: "USER" as const,
  createdAt: "2025-01-15T10:00:00Z",
};

export const mockSkills = [
  { id: "s1", userId: "u2", title: "React & TypeScript Mastery", description: "Learn modern React patterns, hooks, TypeScript integration, and state management with real-world projects.", category: "Web Development", level: "INTERMEDIATE" as const, priceCoins: 100, isActive: true, mentor: { name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", reputationScore: 4.9, teachingStreak: 28 }, reviewCount: 47 },
  { id: "s2", userId: "u3", title: "Python Data Science Pipeline", description: "Build end-to-end data pipelines with pandas, scikit-learn, and visualization libraries.", category: "Data Science", level: "EXPERT" as const, priceCoins: 100, isActive: true, mentor: { name: "Marcus Lee", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus", reputationScore: 4.8, teachingStreak: 15 }, reviewCount: 32 },
  { id: "s3", userId: "u4", title: "UI/UX Design Fundamentals", description: "Master Figma, design systems, user research, wireframing, and prototyping from scratch.", category: "Design", level: "BEGINNER" as const, priceCoins: 30, isActive: true, mentor: { name: "Priya Patel", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", reputationScore: 4.6, teachingStreak: 9 }, reviewCount: 21 },
  { id: "s4", userId: "u5", title: "DevOps & Docker Deep Dive", description: "Containerization, CI/CD pipelines, Kubernetes basics, and cloud deployment strategies.", category: "DevOps", level: "INTERMEDIATE" as const, priceCoins: 100, isActive: true, mentor: { name: "James Wilson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James", reputationScore: 4.5, teachingStreak: 6 }, reviewCount: 18 },
  { id: "s5", userId: "u6", title: "Mobile App with Flutter", description: "Cross-platform mobile development with Flutter and Dart. Build beautiful, performant apps.", category: "Mobile Development", level: "BEGINNER" as const, priceCoins: 30, isActive: true, mentor: { name: "Emma Davis", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", reputationScore: 4.7, teachingStreak: 11 }, reviewCount: 25 },
  { id: "s6", userId: "u7", title: "Blockchain & Solidity", description: "Smart contract development, DeFi protocols, and Web3 integration patterns.", category: "Blockchain", level: "EXPERT" as const, priceCoins: 100, isActive: true, mentor: { name: "Raj Kumar", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Raj", reputationScore: 4.4, teachingStreak: 4 }, reviewCount: 12 },
];

export const mockSessions = [
  { id: "sess1", mentorId: "u2", studentId: "u1", skillId: "s1", skillTitle: "React & TypeScript Mastery", mentorName: "Sarah Chen", mentorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), status: "PENDING" as const },
  { id: "sess2", mentorId: "u1", studentId: "u3", skillId: "s3", skillTitle: "UI/UX Design Fundamentals", mentorName: "You (Teaching)", mentorAvatar: mockUser.avatar, startTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), endTime: new Date(Date.now() + 26.5 * 60 * 60 * 1000).toISOString(), status: "PENDING" as const },
  { id: "sess3", mentorId: "u4", studentId: "u1", skillId: "s2", skillTitle: "Python Data Science Pipeline", mentorName: "Marcus Lee", mentorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus", startTime: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), endTime: new Date(Date.now() - 47 * 60 * 60 * 1000).toISOString(), status: "COMPLETED" as const },
];

export const mockTransactions = [
  { id: "t1", fromUserId: null, toUserId: "u1", amount: 50, type: "EARN" as const, status: "COMPLETED" as const, description: "Signup Bonus", createdAt: "2025-01-15T10:00:00Z" },
  { id: "t2", fromUserId: null, toUserId: "u1", amount: 50, type: "EARN" as const, status: "COMPLETED" as const, description: "GitHub Verification Bonus", createdAt: "2025-01-15T10:05:00Z" },
  { id: "t3", fromUserId: null, toUserId: "u1", amount: 50, type: "EARN" as const, status: "COMPLETED" as const, description: "LinkedIn Verification Bonus", createdAt: "2025-01-15T10:10:00Z" },
  { id: "t4", fromUserId: "u1", toUserId: null, amount: 100, type: "SPEND" as const, status: "COMPLETED" as const, description: "Booked: React & TypeScript Mastery", createdAt: "2025-02-01T14:00:00Z" },
  { id: "t5", fromUserId: null, toUserId: "u1", amount: 95, type: "EARN" as const, status: "COMPLETED" as const, description: "Teaching: UI/UX Design Fundamentals", createdAt: "2025-02-10T16:00:00Z" },
  { id: "t6", fromUserId: null, toUserId: "u1", amount: 85, type: "BOUNTY" as const, status: "COMPLETED" as const, description: "Bounty: How to set up CI/CD?", createdAt: "2025-02-15T11:00:00Z" },
];

export const mockBounties = [
  { id: "b1", posterId: "u3", posterName: "Marcus Lee", posterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus", title: "How to implement WebSocket auth in NestJS?", description: "I need a clear explanation of how to authenticate WebSocket connections in NestJS using JWT tokens.", category: "Web Development", rewardCoins: 50, status: "OPEN" as const, answersCount: 2, expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), createdAt: "2025-03-20T09:00:00Z" },
  { id: "b2", posterId: "u5", posterName: "James Wilson", posterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James", title: "Best practices for React state management in 2025?", description: "Looking for a comparison of Zustand, Jotai, Redux Toolkit, and React Query for different use cases.", category: "Web Development", rewardCoins: 80, status: "OPEN" as const, answersCount: 5, expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), createdAt: "2025-03-22T14:00:00Z" },
  { id: "b3", posterId: "u6", posterName: "Emma Davis", posterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", title: "Optimize PostgreSQL query for full-text search", description: "My tsvector search is slow on 1M+ rows. Need help with GIN index tuning and query optimization.", category: "Data Science", rewardCoins: 100, status: "OPEN" as const, answersCount: 1, expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), createdAt: "2025-03-21T11:00:00Z" },
  { id: "b4", posterId: "u1", posterName: "Alex Johnson", posterAvatar: mockUser.avatar, title: "Docker multi-stage build for monorepo", description: "Need help setting up efficient Docker builds for a pnpm monorepo with shared packages.", category: "DevOps", rewardCoins: 60, status: "CLOSED" as const, answersCount: 3, expiresAt: "2025-03-25T09:00:00Z", createdAt: "2025-03-18T09:00:00Z" },
];

export const mockNotifications = [
  { id: "n1", type: "SESSION_BOOKED", message: "Sarah Chen booked your UI/UX Design session", isRead: false, createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
  { id: "n2", type: "BOUNTY_ANSWER", message: "New answer on your bounty: Docker multi-stage build", isRead: false, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: "n3", type: "SESSION_REMINDER", message: "Your session with Sarah Chen starts in 2 hours", isRead: true, createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
  { id: "n4", type: "COINS_EARNED", message: "You earned 95 SkillCoins for teaching!", isRead: true, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
];

export const categories = ["All", "Web Development", "Data Science", "Design", "DevOps", "Mobile Development", "Blockchain", "Machine Learning", "Cybersecurity"];
export const levels = ["All", "BEGINNER", "INTERMEDIATE", "EXPERT"];
