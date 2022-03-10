import { useFrameGroup } from '../../hooks/frames';
import React from 'react';
import { FrameConfig } from './FrameGroup';

const Frame: React.FC<{
  config: FrameConfig;
}> = ({ config: { id, title, component } }) => {
  const { setFrameTitle } = useFrameGroup();

  const setTitle = React.useCallback(
    (newTitle: string) => {
      setFrameTitle(id, newTitle);
    },
    [id, setFrameTitle],
  );

  return (
    <FrameContext.Provider
      value={{
        id,
        title,
        setTitle,
      }}
    >
      {component}
    </FrameContext.Provider>
  );
};

export interface FrameContextValue {
  id: string;
  title: string;
  setTitle: (title: string) => void;
}

export const FrameContext = React.createContext<FrameContextValue>({
  id: '',
  title: '',
  setTitle: () => {},
});

export default Frame;
