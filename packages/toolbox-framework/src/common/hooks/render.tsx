import React from "react";
// import { isTheSamePlainObject } from "../utils/cmp";

import { isTheSamePlainObject } from "toolbox-utils";

/**
 * 仅当Com的类型或Props改变时才会再次实例化.
 * props将会与上一次props进行各字段的浅比较.
 *
 * @param Com
 * @param params
 * @returns
 */
export function useCachedArrayRender<P>(
  Com: React.FC<P>,
  params: { key: string; props: P }[]
): React.ReactElement[] {
  const ref = React.useRef<{
    cachedProps: Record<string, P>;
    cachedCom: React.FC<P>;
    cachedElems: Record<string, React.ReactElement>;
  }>({
    cachedProps: {},
    cachedCom: () => null,
    cachedElems: {},
  });

  if (ref.current.cachedCom !== Com) {
    ref.current.cachedCom = Com;
    ref.current.cachedProps = {};
    ref.current.cachedElems = {};
  }

  const { cachedProps, cachedCom: PrevCom, cachedElems } = ref.current;
  const elems = [];
  const keysInThisRender: string[] = [];
  for (let { key, props } of params) {
    if (
      cachedElems[key] &&
      cachedProps[key] &&
      isTheSamePlainObject(cachedProps[key], props)
    ) {
      // the same props, do nothing
    } else {
      cachedProps[key] = props;
      cachedElems[key] = <PrevCom key={key} {...props} />;
    }
    elems.push(cachedElems[key]);
    keysInThisRender.push(key);
  }

  // clean cache
  Object.keys(cachedProps)
    .filter((k) => !keysInThisRender.includes(k))
    .forEach((k) => {
      delete cachedProps[k];
    });

  Object.keys(cachedElems)
    .filter((k) => !keysInThisRender.includes(k))
    .forEach((k) => {
      delete cachedElems[k];
    });

  return elems;
}
