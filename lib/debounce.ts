export function debounce(fn: (value: string) => Promise<void>, delay: number) {
  let timeout: NodeJS.Timeout | null = null;
  return (value: string) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(value);
    }, delay);
  };
}