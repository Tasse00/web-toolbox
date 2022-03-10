import React from 'react';

export function useDynamicFields(initialValue: Record<string, any>) {
  const [store, setStore] = React.useState(initialValue);

  return {
    getField: (field: string) => store[field],
    setField: (field: string, value: any) => {
      setStore({ ...store, [field]: value });
    },
    values: store,
  };
}
