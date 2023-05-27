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
      className={`flex ${row ? "flex-row space-x-2" : "flex-col space-y-2"} ${
        selected ? "bg-blue-700 border-blue-500" : "bg-slate-700 border-slate-500"
      } items-center justify-center shadow-lg px-1 py-4 border-4 ${className}`}
    >
      {children}
    </div>
  );
};
