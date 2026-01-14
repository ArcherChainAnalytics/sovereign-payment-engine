export function autoQualify(message: string) {
  const text = message.toLowerCase();

  // Greeting detection
  if (text.includes("hi") || text.includes("hello")) {
    return {
      type: "greeting",
      response: "Hey! What service are you looking for?"
    };
  }

  // Price inquiry
  if (text.includes("price")) {
    return {
      type: "price_inquiry",
      response: "Which offer? Starter, Pro, or Sovereign?"
    };
  }

  // Package selection
  if (text.includes("starter")) {
    return { type: "starter" };
  }

  if (text.includes("pro")) {
    return { type: "pro" };
  }

  if (text.includes("sovereign")) {
    return { type: "sovereign" };
  }

  // Default fallback
  return {
    type: "unknown",
    response: "Got it. Tell me more about what you need."
  };
}
