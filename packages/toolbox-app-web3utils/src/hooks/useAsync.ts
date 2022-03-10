import React from 'react';
import { getPromiseWithAbort } from '../utils/async';

type Service<P extends any[], R = any> = (...params: P) => Promise<R>;

export interface UseAsyncOptions<P extends any[]> {
  auto?: boolean;
  autoParams?: P;
}

export interface UseAsyncResult<P extends any[], R> {
  pending: boolean;
  data: R | undefined;
  error: Error | undefined;

  run: (...args: P) => void;
  mutate: (data: R | undefined) => void;
}

export default function useAsync<P extends any[], R>(
  svc: Service<P, R>,
  { auto = true, autoParams }: UseAsyncOptions<P>,
): UseAsyncResult<P, R> {
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<Error | undefined>(undefined);
  const [data, setData] = React.useState<R | undefined>(undefined);

  const cancelHook = React.useRef<(() => void) | null>(null);

  const run = React.useCallback(
    (...args: P) => {
      cancelHook.current?.();

      setPending(true);
      setData(undefined);
      setError(undefined);

      const { abort, promise } = getPromiseWithAbort(svc(...args));

      cancelHook.current = () => abort('cancelled');

      promise
        .then((result) => {
          setData(result);
          setPending(false);
        })
        .catch((err) => {
          setError(err);
          setPending(false);
        });
    },
    [svc],
  );

  React.useEffect(() => {
    if (auto) {
      if (autoParams === undefined) {
        // @ts-ignore
        run();
      } else {
        run(...autoParams);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, run]);

  return { pending, error, data, run, mutate: setData };
}
