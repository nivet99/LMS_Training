export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  issuedAt: Date;
  verifyCode: string;
  pdfUrl?: string | null;
  revokedAt?: Date | null;
  // joined
  courseName?: string;
  instructorName?: string;
  learnerName?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  xpRequired?: number | null;
  description: string;
}

export interface UserBadge {
  userId: string;
  badgeId: string;
  earnedAt: Date;
  badge: Badge;
}
