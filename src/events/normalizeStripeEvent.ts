import { NormalizedStripeEvent, StripeEventType } from "./eventTypes";

export function normalizeStripeEvent(event: any): NormalizedStripeEvent {
  let type: StripeEventType = "unknown";

  switch (event.type) {
    case "payment_intent.succeeded":
      type = "payment_intent.succeeded";
      break;

    case "payment_intent.payment_failed":
      type = "payment_intent.payment_failed";
      break;

    case "checkout.session.completed":
      type = "checkout.session.completed";
      break;

    case "customer.created":
      type = "customer.created";
      break;

    default:
      type = "unknown";
  }

  return {
    type,
    raw: event.data?.object || event,
    timestamp: Date.now()
  };
import { NormalizedStripeEvent, StripeEventType } from "./eventTypes";

export function normalizeStripeEvent(event: any): NormalizedStripeEvent {
  let type: StripeEventType = "unknown";

  switch (event.type) {
    case "payment_intent.succeeded":
      type = "payment_intent.succeeded";
      break;

    case "payment_intent.payment_failed":
      type = "payment_intent.payment_failed";
      break;

    case "checkout.session.completed":
      type = "checkout.session.completed";
      break;

    case "customer.created":
      type = "customer.created";
      break;

    default:
      type = "unknown";
  }

  return {
    type,
    raw: event.data?.object || event,
    timestamp: Date.now()
  };
}}

