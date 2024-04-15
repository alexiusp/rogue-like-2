export function createDelayEffect(timeoutMs: number) {
  return () => {
    console.log("delay with timeout", timeoutMs, "is running...");
    return new Promise((resolve) => setTimeout(resolve, timeoutMs));
  };
}
