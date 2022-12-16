import type { DiffedProps } from "./element-extenders/map-properties";
import { UnsetProp } from "./element-extenders/map-properties";

const compareFlatArrays = (oldArray?: any[], newArray?: any[]) => {
  if (typeof oldArray !== typeof newArray) {
    return true;
  }

  if (oldArray == undefined) return false;

  if (oldArray?.length !== newArray?.length) {
    return true;
  }

  for (let i = 0; i < oldArray.length; i++) {
    if (oldArray[i] !== newArray[i]) {
      return true;
    }
  }

  return false;
};

const compareFlatRecords = (
  oldStyle: undefined | Record<string, string>,
  newStyle: undefined | Record<string, string>
) => {
  if (typeof oldStyle !== typeof newStyle) {
    return true;
  }

  if (oldStyle == undefined) return false;

  const oldStyleKeys = Object.keys(oldStyle);
  const newStyleKeys = Object.keys(newStyle!);

  if (oldStyleKeys.length !== newStyleKeys.length) {
    return true;
  }

  for (let i = 0; i < oldStyleKeys.length; i++) {
    const key = oldStyleKeys[i];

    if (oldStyle[key] !== newStyle![key]) {
      return true;
    }
  }

  return false;
};

const compareRecordsDeep = (
  oldStyle: undefined | Record<string, string>,
  newStyle: undefined | Record<string, string>
) => {
  if (typeof oldStyle !== typeof newStyle) {
    return true;
  }

  if (oldStyle == undefined) return false;

  const oldStyleKeys = Object.keys(oldStyle);
  const newStyleKeys = Object.keys(newStyle!);

  if (oldStyleKeys.length !== newStyleKeys.length) {
    return true;
  }

  for (let i = 0; i < oldStyleKeys.length; i++) {
    const key = oldStyleKeys[i];
    const typeA = typeof oldStyle[key];
    const typeB = typeof newStyle![key];

    if (typeA !== typeB) {
      return true;
    }

    if (typeA === "object") {
      const a = oldStyle[key] as any as Record<string, string>;
      const b = newStyle![key] as any as Record<string, string>;
      if (compareRecordsDeep(a, b)) {
        return true;
      }
    }

    if (oldStyle[key] !== newStyle![key]) {
      return true;
    }
  }

  return false;
};

export const diffProps = (oldProps: any, newProps: any, gjsElem: boolean) => {
  const diffedProps: DiffedProps = [];

  const oldPropsKeys = Object.keys(oldProps);
  const newPropsKeys = Object.keys(newProps);

  for (let i = 0; i < newPropsKeys.length; i++) {
    const key = newPropsKeys[i];
    if (gjsElem) {
      // we don't want to compare margins by reference, since
      // those can be tuples of numbers, and even if margin values
      // did not change, the tuple reference will be different
      if (key === "margin") {
        if (compareFlatArrays(oldProps[key], newProps[key])) {
          diffedProps.push([key, newProps[key]]);
        }
        continue;
      }

      if (key === "style") {
        if (compareRecordsDeep(oldProps[key], newProps[key])) {
          diffedProps.push([key, newProps[key]]);
        }
        continue;
      }
    }

    if (newProps[key] !== oldProps[key]) {
      diffedProps.push([key, newProps[key]]);
    }
  }

  for (let i = 0; i < oldPropsKeys.length; i++) {
    const key = oldPropsKeys[i];

    if (!newPropsKeys.includes(key)) {
      diffedProps.push([key, UnsetProp]);
    }
  }

  return diffedProps;
};