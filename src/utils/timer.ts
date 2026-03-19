export function createTimer(): { elapsed(): string } {
  const start = performance.now();

  return {
    elapsed(): string {
      const ms = performance.now() - start;
      if (ms >= 1000) {
        return `${(ms / 1000).toFixed(1)}s`;
      }
      return `${Math.round(ms)}ms`;
    },
  };
}
