export const Symbol = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-12 min-w-[3rem] px-2 py-1 text-4xl font-bold bg-gray-800 rounded-full">
      {text}
    </div>
  );
};
