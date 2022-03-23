import React, { useEffect, useRef, useState } from "react";

export function useFocus<T extends HTMLElement>({
  tabIndex = 10000,
}: {
  tabIndex?: number;
} = {}): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (ref.current) {
      const onFocus = () => setFocused(true);
      const onBlur = () => setFocused(false);
      const elem = ref.current;
      if (elem.tabIndex === -1) {
        elem.tabIndex = tabIndex;
      }
      elem.addEventListener("focus", onFocus);
      elem.addEventListener("blur", onBlur);

      return () => {
        elem.removeEventListener("focus", onFocus);
        elem.removeEventListener("blur", onBlur);
      };
    }
  }, [ref, tabIndex]);
  return [ref, focused];
}
