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
        selected ? "bg-blue-100" : "bg-slate-100"
      } items-center justify-center rounded-lg shadow-lg p-3 rounded-3xl border border-slate-200`}
    >
      {children}
    </div>
  );
};
