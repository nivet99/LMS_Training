export { MOCK_USERS } from "./users";
export { MOCK_COURSES } from "./courses";
export {
  MOCK_CHAPTERS,
  MOCK_LESSONS,
  MOCK_PROGRESS,
  MOCK_ENROLLMENTS,
} from "./lessons";
export type { MockChapter, MockLesson, MockQuiz, MockQuestion } from "./lessons";
export {
  MOCK_WEBBOARD_POSTS,
  MOCK_WEBBOARD_REPLIES,
  CATEGORY_LABEL,
  CATEGORY_COLOR,
} from "./webboard";
export type { WebboardPost, WebboardReply, WebboardCategory } from "./webboard";

// Categories derived from courses
export const MOCK_CATEGORIES = [
  { id: "cat_design",    name: "Design",     slug: "design",     icon: "palette" },
  { id: "cat_marketing", name: "การตลาด",   slug: "marketing",  icon: "megaphone" },
  { id: "cat_tech",      name: "เทคโนโลยี", slug: "tech",        icon: "cpu" },
  { id: "cat_finance",   name: "การเงิน",   slug: "finance",     icon: "trending" },
  { id: "cat_language",  name: "ภาษา",       slug: "language",   icon: "globe" },
  { id: "cat_business",  name: "ธุรกิจ",    slug: "business",    icon: "briefcase" },
  { id: "cat_lifestyle", name: "ไลฟ์สไตล์", slug: "lifestyle",  icon: "heart" },
];

export const MOCK_LEADERBOARD = [
  { rank: 1, userId: "user_learner_01", name: "Parichat W.",  image: null, xp: 4250, level: "PLATINUM" as const },
  { rank: 2, userId: "user_learner_02", name: "Thanida J.",   image: null, xp: 3800, level: "PLATINUM" as const },
  { rank: 3, userId: "user_learner_03", name: "Somchai P.",   image: null, xp: 2900, level: "GOLD"     as const },
  { rank: 4, userId: "user_learner_04", name: "Wipawan R.",   image: null, xp: 1650, level: "GOLD"     as const },
  { rank: 5, userId: "user_learner_05", name: "Narut K.",     image: null, xp: 980,  level: "SILVER"   as const },
];
