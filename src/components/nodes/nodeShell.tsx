export const NodeShell = ({
  children,
  row = false,
  selected,
}: {
  children: React.ReactNode;
  selected: boolean;
  row?: boolean;
}) => {
  // nice looking shell for our nodes, tailwind classes

  return (
    <div
      className={`flex ${row ? "flex-row space-x-4" : "flex-col space-y-4"} ${
        selected ? "bg-blue-700 border-blue-500" : "bg-slate-700 border-slate-500"
      } items-center justify-center shadow-lg p-3 rounded-3xl border-4 `}
    >
      {children}
    </div>
  );
};
