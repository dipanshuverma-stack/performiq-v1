// lib/achievements/catalog.ts
import {
  AchievementCategory,
  AchievementRarity,
} from "@prisma/client";
import { ACHIEVEMENT_KEYS } from "./constants";
import { type AchievementIconKey } from "./icons";

export interface AchievementDefinition {
  key: string;
  title: string;
  description: string;
  icon: AchievementIconKey;
  category: AchievementCategory;
  rarity: AchievementRarity;
  rewardPoints: number;
  xp: number;
  hidden: boolean;
  sortOrder: number;
}

// Spreading helper to streamline progression matching and future custom deltas
const reward = (rewardPoints: number, xp = rewardPoints) => ({
  rewardPoints,
  xp,
});

export const ACHIEVEMENTS: Record<string, AchievementDefinition> = {
  // Planner
  [ACHIEVEMENT_KEYS.FIRST_TASK]: {
    key: ACHIEVEMENT_KEYS.FIRST_TASK,
    title: "Getting Started",
    description: "Complete your first planner task.",
    icon: "ClipboardCheck",
    category: AchievementCategory.PLANNER,
    rarity: AchievementRarity.COMMON,
    ...reward(10),
    hidden: false,
    sortOrder: 1,
  },
  [ACHIEVEMENT_KEYS.PLANNER_25]: {
    key: ACHIEVEMENT_KEYS.PLANNER_25,
    title: "Consistent Planner",
    description: "Complete 25 planner tasks.",
    icon: "CalendarCheck",
    category: AchievementCategory.PLANNER,
    rarity: AchievementRarity.RARE,
    ...reward(25),
    hidden: false,
    sortOrder: 2,
  },
  [ACHIEVEMENT_KEYS.PLANNER_100]: {
    key: ACHIEVEMENT_KEYS.PLANNER_100,
    title: "Master Planner",
    description: "Complete 100 planner tasks.",
    icon: "CalendarDays",
    category: AchievementCategory.PLANNER,
    rarity: AchievementRarity.EPIC,
    ...reward(75),
    hidden: false,
    sortOrder: 3,
  },

  // Practice
  [ACHIEVEMENT_KEYS.FIRST_PRACTICE]: {
    key: ACHIEVEMENT_KEYS.FIRST_PRACTICE,
    title: "Practice Begins",
    description: "Complete your first practice session.",
    icon: "BookOpen",
    category: AchievementCategory.PRACTICE,
    rarity: AchievementRarity.COMMON,
    ...reward(10),
    hidden: false,
    sortOrder: 10,
  },
  [ACHIEVEMENT_KEYS.PRACTICE_10]: {
    key: ACHIEVEMENT_KEYS.PRACTICE_10,
    title: "Practice Warrior",
    description: "Complete 10 practice sessions.",
    icon: "Target",
    category: AchievementCategory.PRACTICE,
    rarity: AchievementRarity.RARE,
    ...reward(25),
    hidden: false,
    sortOrder: 11,
  },
  [ACHIEVEMENT_KEYS.PRACTICE_50]: {
    key: ACHIEVEMENT_KEYS.PRACTICE_50,
    title: "Practice Machine",
    description: "Complete 50 practice sessions.",
    icon: "Brain",
    category: AchievementCategory.PRACTICE,
    rarity: AchievementRarity.EPIC,
    ...reward(50),
    hidden: false,
    sortOrder: 12,
  },
  [ACHIEVEMENT_KEYS.PRACTICE_100]: {
    key: ACHIEVEMENT_KEYS.PRACTICE_100,
    title: "Practice Legend",
    description: "Complete 100 practice sessions.",
    icon: "Flame",
    category: AchievementCategory.PRACTICE,
    rarity: AchievementRarity.LEGENDARY,
    ...reward(100),
    hidden: false,
    sortOrder: 13,
  },

  // Mock
  [ACHIEVEMENT_KEYS.FIRST_MOCK]: {
    key: ACHIEVEMENT_KEYS.FIRST_MOCK,
    title: "First Mock",
    description: "Complete your first mock test.",
    icon: "FileCheck",
    category: AchievementCategory.MOCK,
    rarity: AchievementRarity.COMMON,
    ...reward(15),
    hidden: false,
    sortOrder: 20,
  },
  [ACHIEVEMENT_KEYS.MOCK_10]: {
    key: ACHIEVEMENT_KEYS.MOCK_10,
    title: "Mock Challenger",
    description: "Complete 10 mock tests.",
    icon: "Award",
    category: AchievementCategory.MOCK,
    rarity: AchievementRarity.RARE,
    ...reward(50),
    hidden: false,
    sortOrder: 21,
  },
  [ACHIEVEMENT_KEYS.MOCK_50]: {
    key: ACHIEVEMENT_KEYS.MOCK_50,
    title: "Mock Champion",
    description: "Complete 50 mock tests.",
    icon: "Trophy",
    category: AchievementCategory.MOCK,
    rarity: AchievementRarity.LEGENDARY,
    ...reward(100),
    hidden: false,
    sortOrder: 22,
  },

  // Reward
  [ACHIEVEMENT_KEYS.REWARD_100]: {
    key: ACHIEVEMENT_KEYS.REWARD_100,
    title: "100 Club",
    description: "Earn 100 reward points.",
    icon: "Coins",
    category: AchievementCategory.REWARD,
    rarity: AchievementRarity.COMMON,
    ...reward(10),
    hidden: false,
    sortOrder: 30,
  },
  [ACHIEVEMENT_KEYS.REWARD_500]: {
    key: ACHIEVEMENT_KEYS.REWARD_500,
    title: "Reward Hunter",
    description: "Earn 500 reward points.",
    icon: "Gem",
    category: AchievementCategory.REWARD,
    rarity: AchievementRarity.EPIC,
    ...reward(25),
    hidden: false,
    sortOrder: 31,
  },
  [ACHIEVEMENT_KEYS.REWARD_1000]: {
    key: ACHIEVEMENT_KEYS.REWARD_1000,
    title: "Reward Master",
    description: "Earn 1000 reward points.",
    icon: "Crown",
    category: AchievementCategory.REWARD,
    rarity: AchievementRarity.LEGENDARY,
    ...reward(50),
    hidden: false,
    sortOrder: 32,
  },

  // Streak
  [ACHIEVEMENT_KEYS.STREAK_3]: {
    key: ACHIEVEMENT_KEYS.STREAK_3,
    title: "3 Day Streak",
    description: "Maintain a 3-day study streak.",
    icon: "Flame",
    category: AchievementCategory.STREAK,
    rarity: AchievementRarity.COMMON,
    ...reward(15),
    hidden: false,
    sortOrder: 40,
  },
  [ACHIEVEMENT_KEYS.STREAK_7]: {
    key: ACHIEVEMENT_KEYS.STREAK_7,
    title: "One Week Strong",
    description: "Maintain a 7-day study streak.",
    icon: "Sparkles",
    category: AchievementCategory.STREAK,
    rarity: AchievementRarity.RARE,
    ...reward(35),
    hidden: false,
    sortOrder: 41,
  },
  [ACHIEVEMENT_KEYS.STREAK_30]: {
    key: ACHIEVEMENT_KEYS.STREAK_30,
    title: "Unstoppable",
    description: "Maintain a 30-day study streak.",
    icon: "Medal",
    category: AchievementCategory.STREAK,
    rarity: AchievementRarity.LEGENDARY,
    ...reward(100),
    hidden: false,
    sortOrder: 42,
  },
};

// Pure UI and sequencing derivation layer
export const ACHIEVEMENT_LIST = Object.values(ACHIEVEMENTS).sort(
  (a, b) => a.sortOrder - b.sortOrder
);