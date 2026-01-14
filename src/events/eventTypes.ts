export type StripeEventType =
  | "payment_intent.succeeded"
  | "payment_intent.payment_failed"
  | "checkout.session.completed"
  | "customer.created"
  | "unknown";

export interface NormalizedStripeEvent {
  type: StripeEventType;
  raw: any;
  timestamp: number;
}
