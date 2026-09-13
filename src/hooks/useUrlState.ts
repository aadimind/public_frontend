import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export function useUrlState<T extends string>(
  key: string,
  defaultValue: T
): [T, (value: T | null) => void] {
  const [params, setParams] = useSearchParams();
  const value = (params.get(key) as T) || defaultValue;

  const setValue = useCallback(
    (next: T | null) => {
      setParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          if (next === null || next === defaultValue || next === "") {
            p.delete(key);
          } else {
            p.set(key, next);
          }
          return p;
        },
        { replace: true }
      );
    },
    [setParams, key, defaultValue]
  );

  return [value, setValue];
}

export function useUrlParam(key: string): [string | null, (value: string | null) => void] {
  const [params, setParams] = useSearchParams();
  const value = params.get(key);

  const setValue = useCallback(
    (next: string | null) => {
      setParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          if (next === null || next === "") {
            p.delete(key);
          } else {
            p.set(key, next);
          }
          return p;
        },
        { replace: true }
      );
    },
    [setParams, key]
  );


  return [value, setValue];
}
