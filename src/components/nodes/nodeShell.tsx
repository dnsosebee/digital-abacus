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
        selected ? "bg-blue-100" : "bg-orange-100"
      } items-center justify-center rounded-lg shadow-lg p-2 rounded-2xl`}
    >
      {children}
    </div>
  );
};
