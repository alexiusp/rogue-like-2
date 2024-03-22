export function createDelayEffect(timeoutMs: number) {
  return () => new Promise((resolve) => setTimeout(resolve, timeoutMs));
}
