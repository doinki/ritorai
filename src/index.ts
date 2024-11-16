export function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'));
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', handleAbort);

      resolve();
    }, ms);

    function handleAbort() {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    }

    signal?.addEventListener('abort', handleAbort, {
      once: true,
    });
  });
}

export interface RitoraiOptions {
  /**
   * @default 166
   */
  delay?: number | ((count: number) => number);

  /**
   * @default 1
   */
  max?: number;

  signal?: AbortSignal;
}

export async function ritorai<T>(
  fn: () => Promise<T> | T,
  options: RitoraiOptions = {}
  // @ts-ignore
): Promise<T> {
  const { delay = 166, max = 1, signal } = options;

  for (let i = 0; i <= max; i += 1) {
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    try {
      return await fn();
    } catch (error) {
      if (i >= max) {
        throw error;
      }

      await wait(typeof delay === 'function' ? delay(i + 1) : delay, signal);
    }
  }
}
