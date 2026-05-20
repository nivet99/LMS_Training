export type PaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";
export type DiscountType  = "PERCENTAGE" | "FIXED" | "FREE";

export interface Payment {
  id: string;
  userId: string;
  courseId?: string | null;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  invoiceUrl?: string | null;
  createdAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  plan: string;
  status: string;
  currentPeriodEnd: Date;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  maxUses?: number | null;
  usedCount: number;
  expiresAt?: Date | null;
}

export interface PayoutRequest {
  id: string;
  instructorId: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PAID";
  createdAt: Date;
  processedAt?: Date | null;
  note?: string | null;
}
