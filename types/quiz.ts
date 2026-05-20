export type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK" | "MATCHING" | "SHORT_ANSWER";

export interface Quiz {
  id: string;
  lessonId: string;
  passingScore: number;
  timeLimitSecs?: number | null;
  randomize: boolean;
  maxAttempts?: number | null;
  showAnswersAfter: boolean;
  questions: Question[];
}

export interface Question {
  id: string;
  quizId: string;
  type: QuestionType;
  content: string;
  order: number;
  points: number;
  answers: Answer[];
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  isCorrect: boolean;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  passed: boolean;
  startedAt: Date;
  submittedAt?: Date | null;
}

export interface QuizSubmission {
  quizId: string;
  answers: { questionId: string; answerId?: string; text?: string }[];
}
