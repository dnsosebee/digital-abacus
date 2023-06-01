export const NodeShell = ({
  children,
  row = false,
  selected,
  className = "",
}: {
  children: React.ReactNode;
  selected: boolean;
  row?: boolean;
  className?: string;
}) => {
  // nice looking shell for our nodes, tailwind classes

  return (
    <div
      className={`flex ${row ? "flex-row space-x-1" : "flex-col space-y-1"} ${
        selected ? "bg-blue-300" : "bg-white"
      } items-center justify-center shadow-lg px-1 py-4 border-1 border-gray-550 ${className}`}
    >
      {children}
    </div>
  );
};
