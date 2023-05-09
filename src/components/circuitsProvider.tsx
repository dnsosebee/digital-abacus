import { createContext, useContext } from "react";

export const circuitsContext = createContext<{ altPressed: boolean; copied: boolean }>({
  altPressed: false,
  copied: false,
});

export const CircuitsProvider = ({
  children,
  altPressed,
  copied,
}: {
  children: React.ReactNode;
  altPressed: boolean;
  copied: boolean;
}) => {
  return (
    <circuitsContext.Provider value={{ altPressed, copied }}>{children}</circuitsContext.Provider>
  );
};

export const useCircuits = () => {
  try {
    return useContext(circuitsContext);
  } catch (e) {
    throw new Error("useCircuits must be used within a CircuitsProvider");
  }
};
