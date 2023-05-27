export const Button = ({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) => {
  return (
    <button onClick={onClick} className={`px-6 flex justify-center items-center ${className}`}>
      {children}
    </button>
  );
};

export const VerticalLine = () => {
  return <div className="w-0.5 bg-slate-500 min-h-full" />;
};
