export interface ForumPost {
  id: string;
  courseId: string;
  userId: string;
  parentId?: string | null;
  content: string;
  isPinned: boolean;
  isHidden: boolean;
  createdAt: Date;
  updatedAt: Date;
  // joined
  author?: {
    id: string;
    name: string | null;
    image: string | null;
    role: string;
  };
  replies?: ForumPost[];
  replyCount?: number;
}
