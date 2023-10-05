import { useMainGraph } from "@/model/store";

export const NodeShell = ({
  children,
  row = false,
  selected,
  className = "",
  id,
}: {
  children: React.ReactNode;
  selected: boolean;
  row?: boolean;
  className?: string;
  id: string;
}) => {
  // nice looking shell for our nodes, tailwind classes

  const { encapsulatedNodes } = useMainGraph();

  const displaySelected = encapsulatedNodes
    ? encapsulatedNodes.includes(id)
      ? true
      : false
    : selected;

  return (
    <div
      className={`flex ${row ? "flex-row space-x-1" : "flex-col space-y-1"} ${
        displaySelected ? "bg-blue-300" : "bg-white"
      } items-center justify-center shadow-lg px-1 py-4 border-1 border-gray-550 ${className}`}
    >
      {children}
    </div>
  );
};
