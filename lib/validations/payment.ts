import { z } from "zod";

export const CreateCheckoutSchema = z.object({
  courseId: z.string().cuid(),
  couponCode: z.string().optional(),
});

export const RequestPayoutSchema = z.object({
  amount: z.number().min(500, "ยอดขั้นต่ำในการถอนคือ ฿500"),
});

export type CreateCheckoutInput = z.infer<typeof CreateCheckoutSchema>;
export type RequestPayoutInput  = z.infer<typeof RequestPayoutSchema>;
