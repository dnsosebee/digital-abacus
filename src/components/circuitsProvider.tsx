import { createContext, useContext } from "react";

export const circuitsContext = createContext<{ dragging: boolean }>({ dragging: false });

export const CircuitsProvider = ({
  children,
  dragging,
}: {
  children: React.ReactNode;
  dragging: boolean;
}) => {
  return <circuitsContext.Provider value={{ dragging }}>{children}</circuitsContext.Provider>;
};

export const useCircuits = () => {
  try {
    return useContext(circuitsContext);
  } catch (e) {
    throw new Error("useCircuits must be used within a CircuitsProvider");
  }
};
