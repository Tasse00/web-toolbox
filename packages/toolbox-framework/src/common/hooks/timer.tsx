import { useEffect, useRef } from "react";

interface Options {
  enabled: boolean;
}

export function useInterval(
  func: () => any,
  interval: number,
  options?: Options
) {
  const { enabled = true } = options || {};
  const ref = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    if (enabled) {
      ref.current = setInterval(func, interval);
      return () => {
        if (ref.current) {
          clearInterval(ref.current);
        }
      };
    }
  }, [enabled, ref, interval, func]);
}
